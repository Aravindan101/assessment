import './App.css';
import HierarchicalTable from './components/HierarchicalTable';

const rows = [
  {
    id: 'electronics',
    label: 'Electronics',
    value: 0, // This will be calculated
    children: [
      {
        id: 'phones',
        label: 'Phones',
        value: 800
      },
      {
        id: 'laptops',
        label: 'Laptops',
        value: 700
      }
    ]
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 0, // This will be calculated
    children: [
      {
        id: 'tables',
        label: 'Tables',
        value: 300
      },
      {
        id: 'chairs',
        label: 'Chairs',
        value: 700
      }
    ]
  }
];

function App() {
  return (
    <div>
      <HierarchicalTable rows={rows} />
    </div>
  );
}

export default App;