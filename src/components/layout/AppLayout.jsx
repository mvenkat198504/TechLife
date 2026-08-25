import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import './AppLayout.css';

export const AppLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-container">
        {showSidebar && <Sidebar />}
        <main className="app-content">
          <div className="app-main">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
