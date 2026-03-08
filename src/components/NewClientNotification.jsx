function NewClientNotification() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">🔔</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">New Assignment:</span> You have been assigned a new taxpayer
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewClientNotification;
