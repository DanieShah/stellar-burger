import React, { FC, useEffect, useState } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation, useNavigation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState<string>('/');

  useEffect(() => {
    setIsActive(location.pathname);
  }, [location]);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to={'/'} className={styles.link}>
            <BurgerIcon type={isActive === '/' ? 'secondary' : 'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink to={'/feed'} className={styles.link}>
            <ListIcon type={isActive === '/feed' ? 'secondary' : 'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink to={'/profile'} className={styles.link}>
          <ProfileIcon
            type={isActive === '/profile' ? 'secondary' : 'primary'}
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
