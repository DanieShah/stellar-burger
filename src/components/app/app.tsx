import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useSelector, useDispatch } from '../../services/store';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigation
} from 'react-router-dom';
import { useEffect } from 'react';
import {
  createConstructorObject,
  filterIngredientsByType,
  getIngredientsApiThunk
} from '../../slices/api-ingredients-slice';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';
import { checkUserAuthThunk } from '../../slices/api-user-silce';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation = location.state?.background;

  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(checkUserAuthThunk());
    dispatch(getIngredientsApiThunk()).then((el) => {
      dispatch(filterIngredientsByType());
    });
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route
          path='profile/orders/:number'
          element={<OnlyAuth component={<IngredientDetails />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали заказа'} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='profile/orders/:number'
            element={
              <OnlyAuth
                component={
                  <Modal title={'Детали заказа'} onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
