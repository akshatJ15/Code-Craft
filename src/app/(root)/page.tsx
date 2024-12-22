import Header from './_components/Header';
import EditorPanel from './_components/EditorPanel';
import OutputPanel from './_components/OutputPanel';
import { SignInButton } from '@clerk/nextjs';


export default function Home() {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1800px] ma-auto p-4">
          {/* <SignInButton /> */}
          <Header />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    );
  }
  