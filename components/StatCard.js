export default function StatCard({ icon, iconBg, iconColor, badge, badgeColor, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
