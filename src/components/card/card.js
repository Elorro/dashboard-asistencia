export default function Card({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
