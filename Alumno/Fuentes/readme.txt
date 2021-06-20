En esta carpeta se incluye:

	·BackPotteryWeb-> El código backend del proyecto.
	·FrontPotteryWeb-> El código frontend del proyecto.

------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------
USUARIO ADMINISTRADOR: 
	email -- > campon@gmail.com
	password --> MJ

USUARIO SOCIO:
	email --> mj@gmail.com
	password--> MJ 

------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------

Si se despliega la app totalmente desde local:
	·Se necesitará XAMPP para la la BBDD.
	·Seguir el readme de BackPotteryWeb.
	·Asegurarse que en el archivo .env de FrontPotteryWeb está 
		-VUE_APP_API=http://localhost:8000/api (sin comentar).
		-VUE_APP_API=https://potteryweb.herokuapp.com/api  (comentada)
	·Seguir el readme de FrontPotteryWeb.

------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------

Si se despliega con backend de Heroku:
(Probar a funcionar la app sin el PASO #. Si falla al logarse, realizar los pasos incluyendo el PASO #)
	·Recordar que Heroku va lento.
	·PASO #--> Desde BackPotteryWeb:
		·heroku ps:exec potteryweb
		·php artisan passport:keys
	·Asegurarse que en el archivo .env de FrontPotteryWeb está 
		-VUE_APP_API=http://localhost:8000/api (comentada).
		-VUE_APP_API=https://potteryweb.herokuapp.com/api  (sin comentar)
	·Seguir el readme de FrontPotteryWeb

------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------
PARA CAMBIAR EL ENVIO DE EMAILS DESDE UN CORREO REAL:
	Primero: seguir estos pasos para activar la cuenta:
		https://programacionymas.com/blog/como-enviar-mails-correos-desde-laravel 

	Segundo, en el archivo .env de BackPotteryWeb se debe realizar los siguientes cambios:
		MAIL_MAILER=smtp
		MAIL_HOST=smtp.gmail.com
		MAIL_PORT=587
		MAIL_USERNAME=correo@gmail.com
		MAIL_PASSWORD=claveDeSeguridadDada