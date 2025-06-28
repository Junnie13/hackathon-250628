import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { TabNavigation, TabType } from './components/Layout/TabNavigation';
import { DashboardView } from './components/Dashboard/DashboardView';
import { LeadGenView } from './components/Leads/LeadGenView';
import { CampaignView } from './components/Campaigns/CampaignView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { OptimizationView } from './components/Optimization/OptimizationView';
import { IntelligenceView } from './components/Intelligence/IntelligenceView';
import { HomePage } from './components/Auth/HomePage';
import { SignInPage } from './components/Auth/SignInPage';
import { SignUpPage } from './components/Auth/SignUpPage';
import { supabase } from './lib/supabase';

type AuthState = 'home' | 'signin' | 'signup' | 'authenticated';

function App() {
  // For demo purposes, we're bypassing authentication
  const [authState, setAuthState] = useState<AuthState>('authenticated');
  const [activeTab, setActiveTab] = useState<TabType>('intelligence');
  const [user, setUser] = useState<any>({ id: 'demo-user', email: 'demo@example.com' });

  // Comment out the authentication logic for the demo
  /*
  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setAuthState('authenticated');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setAuthState('authenticated');
      } else {
        setUser(null);
        setAuthState('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  */

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please check your credentials.');
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      alert('Check your email for the confirmation link!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadGenView />;
      case 'campaigns':
        return <CampaignView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'optimization':
        return <OptimizationView />;
      case 'intelligence':
        return <IntelligenceView />;
      default:
        return <DashboardView />;
    }
  };

  if (authState === 'home') {
    return (
      <HomePage 
        onSignIn={() => setAuthState('signin')}
        onSignUp={() => setAuthState('signup')}
      />
    );
  }

  if (authState === 'signin') {
    return (
      <SignInPage 
        onBack={() => setAuthState('home')}
        onSignUp={() => setAuthState('signup')}
        onSignIn={handleSignIn}
      />
    );
  }

  if (authState === 'signup') {
    return (
      <SignUpPage 
        onBack={() => setAuthState('home')}
        onSignIn={() => setAuthState('signin')}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden">
      <Header onSignOut={handleSignOut} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveView()}
    </div>
  );
}

export default App;