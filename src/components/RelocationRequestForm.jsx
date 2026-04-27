import React, { useState } from 'react';
import api from '../utils/api';

function RelocationRequestForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    businessName: '',
    tinNumber: '',
    currentAddress: '',
    currentPostcode: '',
    newAddress: '',
    newPostcode: '',
    relocationDate: '',
    reasonForRelocation: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.tinNumber.trim()) newErrors.tinNumber = 'TIN number is required';
    if (!formData.currentAddress.trim()) newErrors.currentAddress = 'Current address is required';
    if (!formData.currentPostcode.trim()) newErrors.currentPostcode = 'Current postcode is required';
    if (!formData.newAddress.trim()) newErrors.newAddress = 'New address is required';
    if (!formData.newPostcode.trim()) newErrors.newPostcode = 'New postcode is required';
    if (!formData.relocationDate) newErrors.relocationDate = 'Relocation date is required';
    if (!formData.reasonForRelocation.trim()) newErrors.reasonForRelocation = 'Reason is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await api.post('/relocation-requests', {
          business_name: formData.businessName,
          tin_number: formData.tinNumber,
          current_address: formData.currentAddress,
          current_postcode: formData.currentPostcode,
          new_address: formData.newAddress,
          new_postcode: formData.newPostcode,
          relocation_date: formData.relocationDate,
          reason_for_relocation: formData.reasonForRelocation,
          contact_person: formData.contactPerson,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          additional_info: formData.additionalInfo
        });

        // Call onSubmit prop if provided
        if (onSubmit) {
          onSubmit(response.data);
        }

        // Reset form
        setFormData({
          businessName: '',
          tinNumber: '',
          currentAddress: '',
          currentPostcode: '',
          newAddress: '',
          newPostcode: '',
          relocationDate: '',
          reasonForRelocation: '',
          contactPerson: '',
          contactPhone: '',
          contactEmail: '',
          additionalInfo: ''
        });

        onClose();

        // Clear specific localStorage items
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // Show success message
        alert('Relocation request submitted successfully!');

      } catch (error) {
        console.error('Error submitting relocation request:', error);
        alert('Error submitting request. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Submit New Relocation Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TIN Number *
                </label>
                <input
                  type="text"
                  name="tinNumber"
                  value={formData.tinNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tinNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter TIN number"
                />
                {errors.tinNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.tinNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Address *
                </label>
                <input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter current address"
                />
                {errors.currentAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Postcode *
                  </label>
                  <input
                    type="text"
                    name="currentPostcode"
                    value={formData.currentPostcode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currentPostcode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter current postcode"
                  />
                  {errors.currentPostcode && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPostcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Postcode *
                  </label>
                  <input
                    type="text"
                    name="newPostcode"
                    value={formData.newPostcode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newPostcode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter new postcode"
                  />
                  {errors.newPostcode && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPostcode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Address *
                </label>
                <input
                  type="text"
                  name="newAddress"
                  value={formData.newAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter new address"
                />
                {errors.newAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.newAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* Relocation Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Relocation Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planned Relocation Date *
                </label>
                <input
                  type="date"
                  name="relocationDate"
                  value={formData.relocationDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.relocationDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.relocationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.relocationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Relocation *
                </label>
                <textarea
                  name="reasonForRelocation"
                  value={formData.reasonForRelocation}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.reasonForRelocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Explain why you are relocating your business"
                />
                {errors.reasonForRelocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.reasonForRelocation}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter phone number"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter email address"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information that may be relevant to your relocation request"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RelocationRequestForm;
