import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title and meta description.
 */
export function useDocumentHead({ title, description }: { title: string; description?: string }) {
 useEffect(() => {
 // Update title
 document.title = title ? `${title} | Let's Go Tutors` : "Let's Go Tutors | Personalised Tuition";

 // Update meta description
 if (description) {
 let metaDescription = document.querySelector('meta[name="description"]');
 if (!metaDescription) {
 metaDescription = document.createElement('meta');
 metaDescription.setAttribute('name', 'description');
 document.head.appendChild(metaDescription);
 }
 metaDescription.setAttribute('content', description);
 }
 }, [title, description]);
}
