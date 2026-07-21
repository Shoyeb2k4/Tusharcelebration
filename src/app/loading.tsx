import { Spinner } from '@/components/common/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
