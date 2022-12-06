export default function Spinner() {
  return (
    // <span className="spinner-wrapper h-full w-full flex justify-center items-center absolute inset-0">
    //   <span className="spinner-item animate-spin  flex h-10 w-10 rounded-sm bg-[#FE6847] opacity-75"></span>
    // </span>
    <span className="spinner-wrapper h-full w-full flex justify-center items-center absolute inset-0">
      <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
    </span>
  );
}
