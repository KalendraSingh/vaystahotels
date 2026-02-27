import React, { useState, useEffect, useCallback } from 'react';
import { FaImage, FaCalendarAlt, FaTags, FaEye, FaSave } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [publishDate, setPublishDate] = useState(new Date());
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setCoverImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (title.length > 0) {
      // Simulating AJAX request for title validation
      const timer = setTimeout(() => {
        console.log('Validating title...');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [title]);

  const handleTagInput = (e) => {
    const input = e.target.value;
    if (input.endsWith(',')) {
      setTags([...tags, input.slice(0, -1)]);
      e.target.value = '';
    } else {
      // Simulating AJAX request for tag suggestions
      const suggestions = ['react', 'javascript', 'webdev', 'programming'];
      setTagSuggestions(suggestions.filter((tag) => tag.startsWith(input)));
    }
  };

  const handleSeoPreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <h1 className='text-3xl font-bold mb-6 '>
        Create a New Blog Post
      </h1>

      <div className='mb-6'>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Title
        </label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Enter your blog post title'
          aria-label='Blog post title'
        />
      </div>

      <div className='mb-6'>
        <label
          htmlFor='content'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Content
        </label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className='h-64 mb-2'
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
        />
        <p className='text-sm text-gray-500'>{content.length} characters</p>
      </div>

      <div className='mb-6'>
        <label
          htmlFor='tags'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Tags
        </label>
        <div className='relative'>
          <input
            type='text'
            id='tags'
            onChange={handleTagInput}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter tags separated by commas'
            aria-label='Blog post tags'
          />
          {tagSuggestions.length > 0 && (
            <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto'>
              {tagSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => {
                    setTags([...tags, suggestion]);
                    setTagSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='mt-2 flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Cover Image
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} aria-label='Upload cover image' />
          {coverImage ? (
            <img src={coverImage} alt='Cover' className='max-h-48 mx-auto' />
          ) : (
            <>
              <FaImage className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                Drag and drop an image here, or click to select a file
              </p>
            </>
          )}
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>SEO Options</h2>
        <div className='mb-4'>
          <label
            htmlFor='seoTitle'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            SEO Title
          </label>
          <input
            type='text'
            id='seoTitle'
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter SEO title'
            aria-label='SEO title'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='seoDescription'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            SEO Description
          </label>
          <textarea
            id='seoDescription'
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            rows='3'
            placeholder='Enter SEO description'
            aria-label='SEO description'
          ></textarea>
        </div>
        <button
          onClick={handleSeoPreview}
          className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center'
        >
          <FaEye className='mr-2' /> Preview SEO
        </button>
        {isPreviewOpen && (
          <div className='mt-4 p-4 border border-gray-300 rounded-md'>
            <h3 className='text-xl font-semibold text-blue-600'>{seoTitle}</h3>
            <p className='text-green-700'>
              {window.location.origin}/blog/post-url
            </p>
            <p className='text-sm text-gray-600 mt-1'>{seoDescription}</p>
          </div>
        )}
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Publish Date
        </label>
        <div className='relative'>
          <DatePicker
            selected={publishDate}
            onChange={(date) => setPublishDate(date)}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy h:mm aa'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            aria-label='Select publish date and time'
          />
          <FaCalendarAlt className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          className='bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center text-lg'
        >
          <FaSave className='mr-2' /> Save Post
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
