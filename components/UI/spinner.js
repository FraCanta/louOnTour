export default function Spinner() {
  return (
    <span className="spinner-wrapper h-full w-full flex justify-center items-center absolute inset-0">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
          className="animate-spin h-5 w-5 mr-3 bg-red-400 "
        ></circle>
      </svg>
    </span>
  );
}
