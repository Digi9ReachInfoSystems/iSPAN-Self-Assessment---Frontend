'use client';

import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import client from '../../lib/apollo-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUBMIT_KIDS_PERSONALITY = gql`
  mutation SubmitKidsPersonality($input: KidsPersonalityInput!) {
    submitKidsPersonality(input: $input) {
      id
      name
      age
      submittedAt
      results {
        trait
        score
        level
      }
    }
  }
`;

const KidsPersonalityPage = () => {
  const [submitKidsPersonality] = useMutation(SUBMIT_KIDS_PERSONALITY);

useEffect(() => {
  // Wait for DOM to update
  const timeoutId = setTimeout(() => {
    const form = document.getElementById('personality-form') as HTMLFormElement;

    if (form) {
      const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const name = localStorage.getItem('name')?.trim() || '';
        const email = localStorage.getItem('email')?.trim() || '';
        const age = parseInt(localStorage.getItem('age') || '0');

        if (!name || !email || !age) {
          toast.error('Please fill in name, age, and email in local storage.');
          return;
        }

        const responses: number[] = [];
        for (let i = 1; i <= 10; i++) {
          const q = `q${i}`;
          const selected = form.querySelector<HTMLInputElement>(`input[name="${q}"]:checked`);
          if (!selected) {
            toast.warning(`Please answer question ${i}`);
            return;
          }
          responses.push(parseInt(selected.value));
        }

        try {
          const { data } = await submitKidsPersonality({
            variables: {
              input: { name, age, email, responses },
            },
          });

          toast.success('Submission successful!');
          console.log('Results:', data.submitKidsPersonality.results);
        } catch (error) {
          console.error(error);
          toast.error('Submission failed. Please try again.');
        }
      };

      form.addEventListener('submit', handleSubmit);

      // Cleanup listener on unmount
      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }
  }, 0); // Ensure DOM is ready

  return () => clearTimeout(timeoutId);
}, [submitKidsPersonality]);


  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Personality Puzzle - Kids</title>
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
    <h2>My Personality Puzzle - Kids</h2>
    <form id="personality-form">
      ${[
        "I like talking to people I just met.",
        "I enjoy making up stories, drawings, or games.",
        "I like to keep my things neat and organized.",
        "I care about how my friends feel.",
        "I get upset or angry easily.",
        "I like to try new things, even if they seem hard.",
        "I remember to finish my homework or chores on time.",
        "I listen when others are talking.",
        "I feel worried or sad without knowing why.",
        "I like being in big groups, like parties or team games."
      ].map((text, i) => {
        const n = i + 1;
        return `
          <div class="question">
            <p>${n}. ${text}</p>
            <div class="options">
              <label><input type="radio" name="q${n}" value="3">✅ Always true</label>
              <label><input type="radio" name="q${n}" value="2">🙂 Sometimes true</label>
              <label><input type="radio" name="q${n}" value="1">❌ Not true</label>
            </div>
          </div>
        `;
      }).join('')}
      <input type="submit" value="Submit" />
    </form>
  </div>
</body>
</html>
`;

export default KidsPersonalityPage;
