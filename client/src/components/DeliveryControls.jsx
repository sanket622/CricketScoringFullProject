import { API } from '../api';
import { useMatch } from '../context/MatchContext';

const DeliveryControls = () => {
  const { matchId, refreshMatch } = useMatch();

  const undoDelivery = async () => {
    try {
      await API.post(`/${matchId}/undo`);
      alert('Last delivery undone');
      refreshMatch();
    } catch (err) {
      console.error(err);
      alert('Error undoing delivery');
    }
  };

  const addDelivery = () => {
    alert('Use ExtrasPanel to add delivery!');
  };

  return (
    <div className="flex gap-4">
      <button onClick={addDelivery} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        ➕ Add Delivery
      </button>
      <button onClick={undoDelivery} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
        ↩️ Undo Delivery
      </button>
    </div>
  );
};

export default DeliveryControls;