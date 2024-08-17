import styles from './css/avatarsSlider.module.css'
import { useRef, useEffect, useState } from "react";

export function AvatarsSlider({avatars, selectedAvatar, onSelectAvatar}){
    const swiperRef = useRef(0);


    useEffect(() => {
      const swiperContainer = swiperRef.current;
      const params = {
        navigation: true,
        pagination: true,
        injectStyles: [
            `
              .swiper-button-next,
              .swiper-button-prev {
                color: white;
              }
    
              .swiper-pagination-bullet{
                width: 1rem;
                height: 1rem;
                background-color: white;
              }
          `,
          ],
      };
  
      Object.assign(swiperContainer, params);
      swiperContainer.initialize();
    }, []);

 

    return (
    <swiper-container ref={swiperRef} init="false">
        {
         avatars.map((avatar) => <swiper-slide key={avatar.id} lazy="true" className={styles.slide} style={
        {
            display: 'flex',
             justifyContent: 'center'
        }
         }>
                <img 
                  onClick={(e) => onSelectAvatar(e)} 
                  id={avatar.id} 
                  loading='lazy' 
                  src={avatar.link} 
                  className={selectedAvatar === avatar.id ? styles['avatar-img-selected'] : styles['avatar-img']}
                />            
            </swiper-slide>)
        }
    </swiper-container>
    )
}