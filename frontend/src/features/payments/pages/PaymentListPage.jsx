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
        
        // Transform data if needed (not necessary if API matches DB structure)
        setSlots(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (value) => value ? value.slice(0, 8) + '...' : 'N/A',
    },
    {
      header: 'Number',
      accessor: 'number',
      cell: (value) => value || 'N/A',
    },
    {
      header: 'Floor',
      accessor: 'floor',
      cell: (value) => value?.toString() || 'N/A',
    },
    {
      header: 'Status',
      accessor: 'isAvailable',
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Available' : 'Occupied'}
        </span>
      ),
    },
    {
      header: 'Vehicle',
      accessor: 'vehicleId',
      cell: (value) => value ? value.slice(0, 8) + '...' : 'None',
    },
    {
      header: 'Actions',
      cell: (_, row) => (
        <div className="flex space-x-2">
          <Button size="sm">Edit</Button>
          <Button variant="danger" size="sm">Delete</Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-6">Loading parking slots...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

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
      
      {/* Debug output - remove in production */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Debug Data (remove in production):</h3>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(slots, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ParkingSlotListPage;