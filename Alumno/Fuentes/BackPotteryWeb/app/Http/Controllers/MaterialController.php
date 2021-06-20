<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * CRUD de materiales.
 * Los administradores pueden hacer el CRUD entero.
 * Los usuarios solo podrán listar los materiales.
 */
class MaterialController extends Controller
{
    /**
     * Lista todos los materiales.
     * Filtra los materiales.
     * Puede acceder los usuarios logados.
     *
     */
    public function all(Request $request)
    {
        //Tipos de filtrado:
        $nombre= $request->get('buscaNombre');
        $tipo= $request->get('buscaTipo');
        $temperatura= $request->get('buscaTemperatura');
        $toxico= $request->get('buscaToxico');
        $fecha= $request->get('buscaFechaCreac');

        $materials=Material::nombre($nombre)->tipo($tipo)->temperatura($temperatura)->fecha($fecha)->toxico($toxico)->get();
        return response()->json($materials);
    }

    /**
     * Devuelve un material localizado por el id desde la lista de materiales.
     * Solo puede acceder el tipo administrador.
     */
    public function show($id)
    {
        if(Auth::user()->type=='admin'){
            $material = Material::find($id);
 
            if (!$material) {
                return response()->json([
                    'success' => false,
                    'message' => 'Material no encontrado '
                ], 400);
            }
     
            return response()->json([
                'success' => true,
                'data' => $material->toArray()
            ], 200);

        }else{
            return response()->json(['error' => 'Unauthorised'], 401);
        }
        
    }


    /**
     * Edita el material desde la lista de materiales.
     * Solo puede acceder el tipo administrador.
     */
    public function update(Request $request, $id)
    {
        if(Auth::user()->type=='admin'){
            $material = Material::find($id);
 
            if (!$material) {
                return response()->json([
                    'success' => false,
                    'message' => 'Material no encontrado'
                ], 400);
            }

            //Si existe, primero validamos.   
            $request->validate([
                'name' => 'required|string|min:3|max:20|unique:materials,name,' . $material->id,
                'type_material' => 'required|string|min:3|max:20',
                'temperature' => 'required|int',
                'toxic' => 'required|boolean'
             ]); 
        
            $updated = $material->fill($request->all())->save();
        
            if ($updated)
                return response()->json([
                    'success' => true
                ]);
            else
                return response()->json([
                    'success' => false,
                    'message' => 'El material no puede ser actualizado'
                ], 500);

        }else{
            return response()->json(['error' => 'Unauthorised'], 401);
        }
        
    }


    /**
     * Crea un nuevo material. 
     * Opción desde la vista de listar materiales.
     * Solo puede acceder el tipo administrador.
     */
    public function create(Request $request)
    {
        if(Auth::user()->type=='admin'){
            $request->validate([
                'name' => 'required|string|min:3|max:20|unique:materials,name',
                'type_material' => 'required|string|min:3|max:20',
                'temperature' => 'required|int',
                'toxic' => 'required|boolean'
             ]); 

            
            $material = new Material();
            $material->name = $request->name;
            $material->type_material = $request->type_material;
            $material->temperature = $request->temperature;
            $material->toxic = $request->toxic;
            $material->created_at = Carbon::now()->format('Y-m-d H:i:s');
            $material->updated_at = Carbon::now()->format('Y-m-d H:i:s');
            
            if ($material->save())
                return response()->json([
                    'success' => true,
                    'data' => $material->toArray(),
                ]);
            else
                return response()->json([
                    'success' => false,
                    'message' => 'Se ha producido un error a la hora de crear el material'
                ], 500);
        }else{
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    /**
     * Elimina a un material desde la lista de materiales.
     * Solo puede acceder el tipo administrador.
     */
    public function destroy($id)
    {
        $material = Material::find($id);
 
        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material no encontrado'
            ], 400);
        }
 
        if ($material->delete()) {
            return response()->json([
                'success' => true,
                'message' => 'El material '.$material->name.' ha sido eliminado correctamente',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'El material no puede ser eliminado'
            ], 500);
        }
    }
}
