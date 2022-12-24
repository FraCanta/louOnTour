export default function Spinner() {
  return (
    <span className="spinner h-full w-full flex justify-center items-center absolute inset-0">
      {/* <svg
        className="animate-spin h-5 w-5 mr-3 bg-red-400 "
        viewBox="0 0 24 24"
      ></svg> */}
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          // className="animate-spin h-5 w-5 mr-3 bg-red-400 "
        ></circle>
      </svg>
    </span>
  );
}
