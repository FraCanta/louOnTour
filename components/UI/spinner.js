export default function Spinner() {
  return (
    <span className="spinner-wrapper h-full w-full flex justify-center items-center absolute inset-0">
      <span className="spinner-item animate-spin  flex h-10 w-10 rounded-sm bg-[#FE6847] opacity-75"></span>
    </span>
  );
}
