'use client';

import Image from 'next/image';
import Link from 'next/link';
import stress from '../../../public/pss.webp';
import personalityTest from '../../../public/personality-test.webp';
import kids from '../../../public/persanality-test-kids.webp';

const cards = [
  {
    title: 'Stress Assessment',
    image: stress,
    link: '/stressassessment',
  },
  {
    title: 'Big Five Personality Test',
    image: personalityTest,
    link: '/personality-traits',
  },
  {
    title: 'Kids Personality Puzzle',
    image: kids,
    link: '/personality-pussle-kids',
  },
];

export default function Forms() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
<h2 className="mb-10 text-4xl font-bold text-center md:mb-20 lg:mb-30 md:text-4xl lg:text-6xl text-sky-600 ">
  Personality Test Forms
</h2>

<div className="grid w-full max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
  {cards.map(({ title, image, link }, index) => (
    <Link
      href={link}
      key={title}
      className={`group ${
        cards.length % 2 === 1 && index === cards.length - 1
          ? 'md:col-span-2 md:mx-auto md:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full' // Center last card on second row for md screens
          : ''
      }`}
    >
      <div className="overflow-hidden transition-transform transform bg-white shadow-md cursor-pointer rounded-2xl hover:scale-105 hover:shadow-xl">
        <div className="relative w-full h-60">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  ))}
</div>

    </main>
  );
}
