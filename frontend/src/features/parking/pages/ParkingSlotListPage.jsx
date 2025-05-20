import { useState, useEffect } from 'react';
import Table from '../../../components/common/organisms/Table';
import Button from '../../../components/common/atoms/Button';
import parkingService from '../../../services/parkingService';

const ParkingSlotListPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await parkingService.getAll();
        console.log('API Response:', data);
        setSlots(data || []); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (value) => String(value || 'N/A'),
    },
    {
      header: 'Name',
      accessor: 'name',
      cell: (value) => (value ? String(value).toLowerCase() : 'N/A'),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const status = value ? String(value) : 'unknown';
        return status.toLowerCase();
      },
    },
    {
      header: 'Actions',
      cell: () => ( // Removed unused rowData parameter
        <div className="flex space-x-2">
          <Button size="sm">Edit</Button>
          <Button variant="danger" size="sm">
            Delete
        </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Slots</h1>
        <Button>Add New Slot</Button>
      </div>
      <Table
        columns={columns}
        data={slots}
        emptyMessage="No parking slots available"
      />
    </div>
  );
};

export default ParkingSlotListPage;