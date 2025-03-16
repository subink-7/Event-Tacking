import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = (response) => {
  if (response.IsSuccess) {
    // Success toast
    toast.success(response.Result.message, {
      ...toastConfig,
      style: {
        backgroundColor: 'white',
        color: 'black',
      },
    });
  } else {
  

    toast.error("Something Went Wrong !!!", {
      ...toastConfig,
      style: {
        backgroundColor: 'white',
        color: 'red',
      },
    });
  }
};