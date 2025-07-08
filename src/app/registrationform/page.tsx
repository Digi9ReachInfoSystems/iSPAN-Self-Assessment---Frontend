'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
});

type FormInputs = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  email: string;
  mobile: string;
};

const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const dob = watch('dateOfBirth');

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onSubmit = (data: FormInputs) => {
    const age = calculateAge(data.dateOfBirth);
    localStorage.setItem('name', `${data.firstName} ${data.lastName}`);
    localStorage.setItem('age', String(age));
    localStorage.setItem('email', data.email);
    router.push('/forms-list');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-100 to-white">
      <div className="w-full max-w-4xl px-10 py-8 bg-white border border-gray-200 shadow-md rounded-xl">
        <h2 className="pb-2 mb-6 text-2xl font-bold text-center text-blue-900 border-b border-blue-500">
          Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">First Name</label>
            <input
              type="text"
              {...register('firstName')}
              placeholder="Enter First Name"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">Last Name</label>
            <input
              type="text"
              {...register('lastName')}
              placeholder="Enter Last Name"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter Email"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">Mobile</label>
            <input
              type="text"
              {...register('mobile')}
              placeholder="Enter Mobile Number"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">Date of Birth</label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-blue-800">Age</label>
            <input
              type="text"
              value={calculateAge(dob)}
              readOnly
              placeholder="Calculated Age"
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="mb-1 text-sm font-semibold text-blue-800">Gender</label>
            <select
              {...register('gender')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="mb-1 text-sm font-semibold text-blue-800">Address</label>
            <textarea
              {...register('address')}
              rows={2}
              placeholder="Full Address"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <button
            type="submit"
            className="col-span-1 py-3 text-lg font-bold text-white transition bg-blue-500 rounded-lg shadow cursor-pointer md:col-span-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
