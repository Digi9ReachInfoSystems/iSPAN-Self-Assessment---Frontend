'use client';

import { gql, useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import client from '../../lib/apollo-client';

const SUBMIT_STRESS_ASSESSMENT = gql`
  mutation SubmitStressAssessment($input: StressAssessmentInput!) {
    submitStressAssessment(input: $input) {
      id
      name
      email
      score
      responses
      submittedAt
    }
  }
`;

const StressAssessmentPage = () => {
const [showModal, setShowModal] = useState(false);
const [scoreResult, setScoreResult] = useState<number | null>(null);


  const [submitAssessment] = useMutation(SUBMIT_STRESS_ASSESSMENT, { client });
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const form = document.getElementById('stress-form') as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async function (e) {
      e.preventDefault();

      const name = localStorage.getItem('name') || sessionStorage.getItem('name');
      const email = localStorage.getItem('email') || sessionStorage.getItem('email');
      const age = localStorage.getItem('age') || sessionStorage.getItem('age');

      if (!name || !email || !age) {
        toast.error('User info missing. Please login or register.');
        return;
      }

      const reverseScored = ['q4', 'q5', 'q6', 'q7', 'q9'];
const responses: number[] = [];
let total = 0;

for (let i = 1; i <= 10; i++) {
  const qName = `q${i}`;
  const selected = document.querySelector<HTMLInputElement>(
    `input[name="${qName}"]:checked`
  );

  if (!selected) {
    toast.error(`Please answer question ${i}`);
    return;
  }

  const value = parseInt(selected.value);
  const score = reverseScored.includes(qName) ? 4 - value : value;
  total += score;
  responses.push(value); // original value for DB
}

      try {
        const { data } = await submitAssessment({
          variables: {
            input: {
              name,
              email,
              score: total,
              responses,
            },
          },
        });

        toast.success(`Assessment submitted! Your score: ${data.submitStressAssessment.score}`);
        setScoreResult(data.submitStressAssessment.score);
        setShowModal(true);
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    };
  }, [submitAssessment]);

  return (
    <>
      <Toaster position="top-right" />
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />

      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-2xl font-semibold text-blue-700">Your Stress Score</h3>
      <p className="mb-6 text-xl font-medium text-gray-800">
        You scored <strong>{scoreResult}</strong> out of 40.
      </p>
      <button
      type="button"
        onClick={() => setShowModal(false)}
        className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

    </>
  );
};

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Perceived Stress Scale</title>
  <style>
  body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    // background-image: linear-gradient(to bottom right, #dceefb, #ffffff);
    min-height: 100vh;
    margin: 0;
    padding: 0;
    color: #333;
  }

  .container {
    max-width: 1000px;
    margin: 40px auto;
    background-image: linear-gradient(to bottom right, #dceefb, #ffffff);
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
  }

  h2 {
    text-align: center;
    color: #1e3a8a;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
  }

.question {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f3f4f6; /* Light grey background */
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.options {
  margin-top: 10px;
}

.question p {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 24px;
}

  .options label {
    display: inline-block;
    margin-right: 16px;
    font-weight: 400;
    font-size: 20px;
  }

.options input[type="radio"] {
  accent-color: #3b82f6; /* Tailwind blue-500 */
  margin-right: 6px;
  cursor: pointer;
}

  input[type="submit"] {
    margin-top: 30px;
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(to right, #3b82f6, #60a5fa);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  input[type="submit"]:hover {
    opacity: 0.9;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 20px;
    }

    .question p {
      font-size: 20px;
    }

    .options label {
      font-size: 18px;
      margin-bottom: 8px;
    }

    input[type="submit"] {
      font-size: 14px;
      padding: 10px;
    }
  }

  @media (max-width: 480px) {
  .container{
    margin: 0 auto;
  }
    h2 {
      font-size: 1.5rem;
    }

    .question p {
      font-size: 18px;
    }

    .options label {
      display: block;
      margin-bottom: 10px;
      font-size: 16px;
    }

    input[type="submit"] {
      font-size: 14px;
      padding: 10px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <h2>Perceived Stress Scale</h2>
    <form id="stress-form" method="POST">
      ${[...Array(10)].map((_, i) => {
        const n = i + 1;
        const text = [
          "In the last month, how often have you been upset because something that happened unexpectedly?",
          "In the last month, how often have you felt that you were unable to control the important things in your life?",
          "In the last month, how often have you felt nervous and “stressed”?",
          "In the last month, how often have you deal successfully with irritating life hassles?  ",
          "In the last month, how often have you felt that you were effectively coping with important changes in your life?  ",
          "In the last month, how often have you felt confident about your ability to handle your personal problems?  ",
          "In the last month, how often have you felt that things were going your way?  ",
          "In the last month, how often have you found that you could not cope with all the things that you had to do?",
          "In the last month, how often have you been able to control irritations in your life?  ",
          "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
        ][i];

        return `
        <div class="question">
          <p>${n}. ${text}</p>
          <div class="options">
            <label><input type="radio" name="q${n}" value="0">Never</label>
            <label><input type="radio" name="q${n}" value="1">Almost Never</label>
            <label><input type="radio" name="q${n}" value="2">Sometimes</label>
            <label><input type="radio" name="q${n}" value="3">Fairly Often</label>
            <label><input type="radio" name="q${n}" value="4">Very Often</label>
          </div>
        </div>`;
      }).join('')}
      <input type="submit" value="Submit" />
    </form>
  </div>
</body>
</html>
`;

export default StressAssessmentPage;
