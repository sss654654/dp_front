import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RentalItem } from './RentalItem';
import { Rental, RentalStatus } from '../../types';
import * as XLSX from 'xlsx';

interface RentalListProps {
  rentals: Rental[];
  onReturn: (id: number) => void;
  onDelete: (id: number) => void;
  returningId?: number;
  deletingId?: number;
}

export const RentalList: React.FC<RentalListProps> = ({
  rentals,
  onReturn,
  onDelete,
  returningId,
  deletingId,
}) => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // URL 파라미터에서 filter 읽어서 드롭다운 초기값 설정
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'overdue') {
      setStatusFilter('OVERDUE');
    }
  }, [searchParams]);

  // 필터링 및 검색
  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus = statusFilter === 'ALL' || rental.status === statusFilter;
    const matchesSearch =
      rental.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.renterName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, startIndex + itemsPerPage);

  // 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    // 엑셀로 변환할 데이터 준비
    const excelData = filteredRentals.map((rental) => ({
      '대여 ID': rental.id,
      '물품명': rental.itemName,
      '대여자': rental.renterName,
      '연락처': rental.renterContact,
      '상태': rental.status === 'ONGOING' ? '대여중' : rental.status === 'COMPLETED' ? '반납완료' : '연체',
      '대여일': new Date(rental.rentalDate).toLocaleDateString('ko-KR'),
      '반납예정일': new Date(rental.expectedReturnDate).toLocaleDateString('ko-KR'),
      '실제반납일': rental.returnDate ? new Date(rental.returnDate).toLocaleDateString('ko-KR') : '-',
      '비고': rental.notes || '-',
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '대여 기록');

    // 파일명 생성 (현재 날짜 포함)
    const today = new Date();
    const fileName = `대여기록_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.xlsx`;

    // 파일 다운로드
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-4">
      {/* 필터 및 검색 */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="물품명 또는 대여자 이름 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as RentalStatus | 'ALL');
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
            >
              <option value="ALL">전체</option>
              <option value="ONGOING">대여중</option>
              <option value="COMPLETED">반납완료</option>
              <option value="OVERDUE">연체</option>
            </select>
          </div>

          {/* 엑셀 다운로드 버튼 */}
          <Button
            onClick={handleExcelDownload}
            variant="secondary"
            size="md"
            disabled={filteredRentals.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>

        {/* 결과 요약 */}
        <div className="mt-4 text-sm text-gray-600">
          총 {filteredRentals.length}건의 대여 기록
        </div>
      </Card>

      {/* 대여 목록 */}
      <div className="space-y-3">
        {paginatedRentals.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">대여 기록이 없습니다.</p>
          </Card>
        ) : (
          paginatedRentals.map((rental) => (
            <RentalItem
              key={rental.id}
              rental={rental}
              onReturn={onReturn}
              onDelete={onDelete}
              isReturning={returningId === rental.id}
              isDeleting={deletingId === rental.id}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-[#003876] text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};
