import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FaSort, FaSortUp, FaSortDown, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PatientReport from './PatientReport';

const TableContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  overflow: auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const TableTitle = styled.h3`
  color: var(--neutral-800);
  margin: 0;
`;

const ViewOptions = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const ViewButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--neutral-700)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--neutral-400)'};
  border-radius: var(--border-radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--neutral-200)'};
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
`;

const TableHead = styled.thead`
  border-bottom: 2px solid var(--neutral-300);
`;

const TableHeadCell = styled.th`
  text-align: left;
  padding: var(--space-3);
  color: var(--neutral-700);
  font-weight: 600;
  cursor: ${props => props.canSort ? 'pointer' : 'default'};
  white-space: nowrap;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: var(--neutral-100);
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--neutral-300);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--neutral-200);
  }
`;

const TableCell = styled.td`
  padding: var(--space-3);
`;

const ViewReportButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-4);
  font-size: var(--font-size-sm);
`;

const PaginationInfo = styled.div`
  color: var(--neutral-700);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const PaginationButton = styled.button`
  background-color: ${props => props.disabled ? 'var(--neutral-200)' : 'white'};
  color: ${props => props.disabled ? 'var(--neutral-500)' : 'var(--neutral-700)'};
  border: 1px solid ${props => props.disabled ? 'var(--neutral-300)' : 'var(--neutral-400)'};
  border-radius: var(--border-radius-md);
  padding: var(--space-2);
  font-size: var(--font-size-sm);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--neutral-200);
  }
`;

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'basic', or 'diagnosis'
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Provide a fallback with mock data in case the API is not available
        try {
          const response = await fetch('http://localhost:5000/api/patients');
          if (response.ok) {
            const data = await response.json();
            setPatients(data);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching real patient data:', error);
        }
        
        // Fallback to mock data
        const mockPatients = [
          {
            id: 1,
            name: "Ahmed Khan",
            age: 35,
            gender: "male",
            location: "Islamabad",
            temperature_f: 102.1,
            blood_pressure: "140/90",
            blood_glucose: 110,
            disease: "Dengue",
            severity: "Critical",
            confidence_score: 0.95,
            comment: "Patient shows classic dengue symptoms with high fever and joint pain."
          },
          {
            id: 2,
            name: "Fatima Ali",
            age: 27,
            gender: "female",
            location: "Lahore",
            temperature_f: 99.5,
            blood_pressure: "110/70",
            blood_glucose: 95,
            disease: "Skin infection",
            severity: "Medium",
            confidence_score: 0.88,
            comment: "Localized skin infection requiring antibiotic treatment."
          },
          {
            id: 3,
            name: "Muhammad Saeed",
            age: 62,
            gender: "male",
            location: "Karachi",
            temperature_f: 100.2,
            blood_pressure: "160/95",
            blood_glucose: 180,
            disease: "Tuberculosis",
            severity: "Urgent",
            confidence_score: 0.91,
            comment: "Advanced TB infection requiring immediate isolation and treatment."
          }
        ];
        
        setPatients(mockPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleViewReport = (patient) => {
    setSelectedPatient(patient);
  };

  const closeReport = () => {
    setSelectedPatient(null);
  };

  const columnHelper = createColumnHelper();

  // Define columns based on view mode
  const getColumns = () => {
    const baseColumns = [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue()
      }),
    ];

    const vitalColumns = [
      columnHelper.accessor('age', {
        header: 'Age',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('gender', {
        header: 'Gender',
        cell: info => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('temperature_f', {
        header: 'Temperature (°F)',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('blood_pressure', {
        header: 'Blood Pressure',
        cell: info => info.getValue()
      }),
    ];

    const diagnosisColumns = [
      columnHelper.accessor('disease', {
        header: 'Disease',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('severity', {
        header: 'Severity',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('confidence_score', {
        header: 'Confidence',
        cell: info => `${(info.getValue() * 100).toFixed(1)}%`
      }),
    ];

    const actionColumn = [
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: info => (
          <ViewReportButton onClick={() => handleViewReport(info.row.original)}>
            <FaEye /> View Report
          </ViewReportButton>
        )
      }),
    ];

    if (viewMode === 'all') {
      return [...baseColumns, ...vitalColumns, ...diagnosisColumns, ...actionColumn];
    } else if (viewMode === 'basic') {
      return [...baseColumns, ...vitalColumns, ...actionColumn];
    } else {
      return [...baseColumns, ...diagnosisColumns, ...actionColumn];
    }
  };

  const columns = React.useMemo(() => getColumns(), [viewMode]);
  
  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  if (loading) {
    return <TableContainer>Loading patient data...</TableContainer>;
  }

  return (
    <>
      <TableContainer>
        <TableHeader>
          <TableTitle>Patient Records</TableTitle>
          <ViewOptions>
            <ViewButton 
              active={viewMode === 'all'} 
              onClick={() => setViewMode('all')}
            >
              All Data
            </ViewButton>
            <ViewButton 
              active={viewMode === 'basic'} 
              onClick={() => setViewMode('basic')}
            >
              Basic Info
            </ViewButton>
            <ViewButton 
              active={viewMode === 'diagnosis'} 
              onClick={() => setViewMode('diagnosis')}
            >
              Diagnosis Info
            </ViewButton>
          </ViewOptions>
        </TableHeader>

        <StyledTable>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHeadCell 
                    key={header.id} 
                    onClick={header.column.getToggleSortingHandler()}
                    canSort={header.column.getCanSort()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span>
                      {{
                        asc: <FaSortUp style={{ marginLeft: '4px' }} />,
                        desc: <FaSortDown style={{ marginLeft: '4px' }} />,
                      }[header.column.getIsSorted()] ?? (
                        header.column.getCanSort() ? <FaSort style={{ marginLeft: '4px', opacity: 0.4 }} /> : null
                      )}
                    </span>
                  </TableHeadCell>
                ))}
              </tr>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
        
        <PaginationContainer>
          <PaginationInfo>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton 
              onClick={() => table.previousPage()} 
              disabled={!table.getCanPreviousPage()}
            >
              <FaChevronLeft />
            </PaginationButton>
            <PaginationButton 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaChevronRight />
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      </TableContainer>
      
      {selectedPatient && (
        <PatientReport 
          patient={selectedPatient}
          onClose={closeReport}
        />
      )}
    </>
  );
};

export default PatientTable; 