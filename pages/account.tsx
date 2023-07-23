import AccountHeader from '../components/account/AccountHeader';
import AccountPostCard from '@/components/account/AccountPostCard';
import AccountImagesCard from '@/components/account/AccountImagesCard';
import AccountEditProfile from '@/components/account/AccountEditProfile';
import { useState } from 'react';

const Account = () => {
  const [activeComponent, setActiveComponent] = useState('posts');

  return (
    <>
      <AccountHeader setActiveComponent={setActiveComponent} />
      {activeComponent === 'posts' && <AccountPostCard />}
      {activeComponent === 'images' && <AccountImagesCard />}
      {activeComponent === 'edit' && <AccountEditProfile />}
    </>
  )
}

export default Account
