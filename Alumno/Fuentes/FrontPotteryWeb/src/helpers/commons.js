/*Fichero de métodos comunes de las vistas*/
import axios from "axios";

const commons = {
    /**
     * Muestra un mensaje de error en la vista
     * con un estilo de letras rojo oscuro y fondo rojo claro.
     * @param {*} $this será la vista donde se encuentre
     * @param {*} msg será el mensaje que va a mostrar
     */
    showError: function ($this, msg) {
        $this.messageType = "error";
        $this.message = msg;
    },
    /**
     * Muestra un mensaje de éxito en la vista
     * con un estilo de letras verde oscuro y fondo verde claro.
     * @param {*} $this será la vista donde se encuentre
     * @param {*} msg será el mensaje que va a mostrar
     * @param {*} time será el tiempo que aparecerá el mensaje en pantalla
     */
    showSuccess: function ($this, msg,time) {
        $this.messageType = "success";
        $this.message = msg;

        if (time && time > 0) {
          //1000==1segundo
          setTimeout(function () {
            $this.messageType = null;
            $this.message = null;
          }, time * 1000); //Introduce un numero y se pone a ms
        }
    },
    /**
     * Eliminará un objeto mediante su id en la tabla de BBDD
     * especificada.
     * @param {*} $this será la vista donde se invoque el método
     * @param {*} path será la ruta de la api para el delete
     * @param {*} id será el id del elemento
     * @param {*} model será la tabla de BBDD donde se encuentra el elemento a borrar
     * @param {*} msgEmpty será el mensaje que se mostrará en la tabla en caso de no haber elementos
     */
    destroy: function ($this, path, id, model, msgEmpty) {
        axios
            .delete(`${process.env.VUE_APP_API}/${path}/${id}`)
            .then((result) => {
                if (result.data.success) {
                    commons.showSuccess($this, result.data.message);
                    $this[model] = $this[model].filter((item) => {
                        return item.id != id; //Para que no liste el usuario que se ha borrado
                    });

                    if ($this[model].length == 0) {
                        $this.errorTabla = msgEmpty;
                    }
                } else {
                    commons.showError($this, result.data.message);
                }
            })
            .catch((error) => {
                if (error.response) {
                    commons.showError($this, error.response.data.message);
                } else {
                    commons.showError($this, "Ha ocurrido un error inesperado");
                }
            });
    },
    /**
     * Lista los elementos de una tabla de BBDD. 
     * Lista además los elementos filtrados.
     * @param {*} $this será la vista donde se invoque el método
     * @param {*} path será la ruta de la api para el get
     * @param {*} model será la tabla de BBDD donde se encuentra los elementos a listar
     * @param {*} msgEmpty será el mensaje que se mostrará en la tabla en caso de no haber elementos
     * @param {*} breadcrumbs será las migas de pan que se mostrarán en caso de error
     */
    search: function ($this, path, model, msgEmpty, breadcrumbs) {

        let config = {
            params: $this.searchForm,
        };
        axios
            .get(`${process.env.VUE_APP_API}/${path}`, config)
            .then((result) => {
                $this[model] = result.data.filter((item) => {
                    item.created_at = item.created_at.substring(0, 10); //Modificacion
                    return true; //True porque quiero que me devueva. Si fuera al contrario, pondria false
                });

                if ($this[model].length == 0) {
                    $this.errorTabla = msgEmpty;
                }
            })
            .catch((error) => {
                if (error.response.data.message == "Unauthenticated." ||
                    error.response.data.error == 'Unauthorised') {
                    commons.showError($this, "No estás autorizado para esta vista");
                    $this.$store.commit("SET_TITLE", `${breadcrumbs} --> Error`);
                    $this.auth = false;
                } else {
                    $this[model] = [];
                    $this.errorTabla = "Ha ocurrido un error inesperado";
                }
            });
    },
    /**
     * Guarda la edición o creación de un elemento en la BBDD.
     * @param {*} $this será la vista donde se invoque el método
     * @param {*} action será la acción de get o push para la api
     * @param {*} path será la ruta de la api para el get o push
     * @param {*} model será la tabla de BBDD donde se encuentra los elementos actualizar o crear
     * @param {*} msgSuccess será el mensaje a mostrar en la vista inicial en caso de éxito
     * @param {*} validate será el método de validación de la vista donde se invoque el save
     * @param {*} clear será el método de la vista donde se invoque el save que limpia el form en caso de crear
     */
    save: function ($this, action, path, model, msgSuccess, validate, clear) {
        let actionMethod = axios.post;
        let url = `${process.env.VUE_APP_API}/${path}`;

        if (!validate(model)) {
            return;
        }

        if (action == 'edit') {
            let id = $this.$route.params.id;
            actionMethod = axios.put;
            url = `${url}/${id}`;
        }

        //actionMethod sería axios.put o axios.post
        //es lo mismo que poner (ejemplo de crear):
        //axios.post(`${process.env.VUE_APP_API}/users`,this.user).tal tal tal
        actionMethod(url, model)
            .then((result) => {
                commons.showSuccess($this, msgSuccess);

                //Si se ha pasado el parametro clear y es una función.
                if (typeof clear == 'function') {
                    clear();
                }

            })
            .catch((error) => {
                if (error.response.data.errors) {
                    for (let fieldError in error.response.data.errors) {
                        $this.error[fieldError] = error.response.data.errors[fieldError];
                    }
                } else if (error.response) {
                    commons.showError($this, error.response.data.message);
                } else {
                    commons.showError($this, "Ha ocurrido un error inesperado");
                }
            });
    },
    /**
     * Carga el los elementos necesarios para la vista.
     * @param {*} $this será la vista donde se invoque el método
     * @param {*} path será la ruta de la api para el get
     * @param {*} modelName será la tabla de BBDD donde se encuentra el elemento a mostrar
     * @param {*} breadcrumbs será las migas de pan que se mostrarán en caso de error
     */
    loadForm: function ($this, path, modelName, breadcrumbs) {
        let id = $this.$route.params.id;

        axios
            .get(`${process.env.VUE_APP_API}/${path}/${id}`)
            .then((result) => {
                $this[modelName] = result.data.data;
            })
            .catch((error) => {
                $this[modelName] = {};

                if (error.response.data.message == "Unauthenticated." ||
                    error.response.data.error == 'Unauthorised') {
                    commons.showError($this, "No estás autorizado para esta vista");

                    if (breadcrumbs) {
                        $this.$store.commit("SET_TITLE", `${breadcrumbs} --> Error`);
                    }

                    $this.auth = false;
                } else {
                    commons.showError($this, 'Ha ocurrido un error inesperado');
                }

            });
    },
};

export default commons;