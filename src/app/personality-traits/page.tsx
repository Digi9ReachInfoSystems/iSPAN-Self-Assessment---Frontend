'use client';

import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import client from '../../lib/apollo-client';

const SUBMIT_BIGFIVE_ASSESSMENT = gql`
  mutation SubmitBigFiveAssessment($input: BigFiveAssessmentInput!) {
    submitBigFiveAssessment(input: $input) {
      id
      name
      email
      results {
        trait
        average
        level
      }
      submittedAt
    }
  }
`;

const BigFiveAssessmentPage = () => {
  const [submitAssessment] = useMutation(SUBMIT_BIGFIVE_ASSESSMENT, { client });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const form = document.getElementById('ocean-form') as HTMLFormElement;
      if (!form) return;

      const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const name = localStorage.getItem('name') || sessionStorage.getItem('name');
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');
        const age = localStorage.getItem('age') || sessionStorage.getItem('age');

        if (!name || !email || !age) {
          toast.error('Missing user details. Please log in or register first.');
          return;
        }

        const responses: number[] = [];

        for (let i = 1; i <= 25; i++) {
          const inputName = `q${i}`;
          const selected = form.querySelector<HTMLInputElement>(
            `input[name="${inputName}"]:checked`
          );
          if (!selected) {
            toast.error(`Please answer question ${i}`);
            return;
          }
          responses.push(parseInt(selected.value));
        }

        try {
          const { data } = await submitAssessment({
            variables: {
              input: {
                name,
                email,
                age,
                responses,
              },
            },
          });

          const resultText = data.submitBigFiveAssessment.results
            .map((r: any) => `${r.trait}: ${r.average} (${r.level})`)
            .join('\n');

          toast.success('Assessment submitted successfully!');
          console.log(resultText);
          form.reset();
        } catch (error) {
          console.error('Submission failed', error);
          toast.error('Something went wrong during submission. Please try again later.');
        }
      };

      form.addEventListener('submit', handleSubmit);
      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [submitAssessment]);

  return (
    <>
      <Toaster position="top-right" />
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  );
};

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Big Five Personality Traits</title>
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
    <h2>Big Five Personality Traits</h2>
    <form id="ocean-form" method="POST">
      ${[
        "I am full of ideas",
        "I enjoy trying new and foreign foods",
        "I believe in the importance of art",
        "I am quick to understand things",
        "I have a vivid imagination",
        "I am always prepared",
        "I pay attention to details",
        "I get chores done right away",
        "I like order",
        "I follow a schedule",
        "I am the life of the party",
        "I feel comfortable around people",
        "I start conversations",
        "I talk to a lot of different people at social events",
        "I don’t mind being the center of attention",
        "I am interested in people",
        "I sympathize with others’ feelings",
        "I take time out for others",
        "I make people feel at ease",
        "I have a soft heart",
        "I get stressed out easily",
        "I worry about things",
        "I get upset easily",
        "I have frequent mood swings",
        "I get irritated easily"
      ].map((q, i) => {
        const n = i + 1;
        return `
        <div class="question">
          <p>${n}. ${q}</p>
          <div class="options">
            <label><input type="radio" name="q${n}" value="1">Strongly Disagree</label>
            <label><input type="radio" name="q${n}" value="2">Disagree</label>
            <label><input type="radio" name="q${n}" value="3">Neutral</label>
            <label><input type="radio" name="q${n}" value="4">Agree</label>
            <label><input type="radio" name="q${n}" value="5">Strongly Agree</label>
          </div>
        </div>`;
      }).join('')}
      <input type="submit" value="Submit" />
    </form>
  </div>
</body>
</html>
`;

export default BigFiveAssessmentPage;
