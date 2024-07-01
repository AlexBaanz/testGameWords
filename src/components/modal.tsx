import React from 'react';
import head from '../assets/popup_ribbon.svg'

const Modal: React.FC = () => {

    return (
      <div className='modal'>
          <div className='modal-content'>
              <img className='modal-img' src={head}/>
              <div className='modal-text-header'>Две вкладки<br/> с игрой?</div>
              <div className='modal-text'>Похоже, игра открыта в нескольких вкладках браузера. Чтобы продолжить играть в
                  этой вкладке, обновите страницу.
              </div>
              <div className="button" onClick={()=>location.reload()}>
                  Обновить
              </div>
          </div>
      </div>
    );
};

export default Modal;