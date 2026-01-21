package com.soulink.controller;

import com.soulink.model.Producto;
import com.soulink.repository.ProductosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:8081", "https://proyecto-soulink.vercel.app"})
public class StockController {

    @Autowired
    private ProductosRepository productosRepository;

    @PostMapping("/descontar")
    @Transactional
    public ResponseEntity<Map<String, Object>> descontarStock(@RequestBody List<Map<String, Object>> productos) {
        try {
            System.out.println("=== DESCONTANDO STOCK ===");
            System.out.println("Productos recibidos: " + productos);

            if (productos == null || productos.isEmpty()) {
                return ResponseEntity.badRequest().body(crearError("No hay productos para descontar"));
            }

            Map<String, Object> respuesta = new HashMap<>();
            List<Map<String, Object>> productosProcesados = new ArrayList<>();

            // Procesar cada producto
            for (Map<String, Object> item : productos) {
                // Obtener ID y cantidad
                Long idProducto;
                Integer cantidad;

                try {
                    idProducto = Long.valueOf(item.get("id").toString());
                    cantidad = Integer.valueOf(item.get("cantidad").toString());
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(
                            crearError("Formato incorrecto para producto: " + item)
                    );
                }

                System.out.println("Buscando producto ID: " + idProducto);

                // Buscar producto
                Optional<Producto> optionalProducto = productosRepository.findById(idProducto);

                if (optionalProducto.isEmpty()) {
                    return ResponseEntity.badRequest().body(
                            crearError("Producto no encontrado con ID: " + idProducto)
                    );
                }

                Producto producto = optionalProducto.get();
                System.out.println("Producto encontrado: " + producto.getNombre());

                // Validar stock
                if (producto.getStock() == null) {
                    producto.setStock(0);
                }

                if (producto.getStock() < cantidad) {
                    return ResponseEntity.badRequest().body(
                            crearError("Stock insuficiente para: '" + producto.getNombre() +
                                    "'. Disponible: " + producto.getStock() +
                                    ", Solicitado: " + cantidad)
                    );
                }

                // Descontar stock
                int stockAnterior = producto.getStock();
                int nuevoStock = stockAnterior - cantidad;
                producto.setStock(nuevoStock);

                // Guardar cambios
                productosRepository.save(producto);

                System.out.println("Stock actualizado: " + producto.getNombre() +
                        " -> " + stockAnterior + " - " + cantidad + " = " + nuevoStock);

                // Agregar a resultados
                Map<String, Object> productoInfo = new HashMap<>();
                productoInfo.put("id", producto.getId());
                productoInfo.put("nombre", producto.getNombre());
                productoInfo.put("stock_anterior", stockAnterior);
                productoInfo.put("stock_nuevo", nuevoStock);
                productoInfo.put("cantidad_descontada", cantidad);
                productoInfo.put("precio", producto.getPrecio());

                productosProcesados.add(productoInfo);
            }

            respuesta.put("success", true);
            respuesta.put("message", "Stock descontado correctamente");
            respuesta.put("productos", productosProcesados);
            respuesta.put("total", productosProcesados.size());

            System.out.println("=== STOCK ACTUALIZADO EXITOSAMENTE ===");
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            System.err.println("ERROR descontando stock: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(crearError("Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("StockController funcionando! " + new Date());
    }

    @GetMapping("/productos")
    public ResponseEntity<?> listarProductos() {
        try {
            List<Producto> productos = productosRepository.findAll();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(crearError(e.getMessage()));
        }
    }

    // Endpoint para probar con un solo producto
    @PostMapping("/descontar-test")
    public ResponseEntity<Map<String, Object>> descontarTest() {
        try {
            // Crear datos de prueba
            List<Map<String, Object>> productosTest = new ArrayList<>();

            Map<String, Object> producto1 = new HashMap<>();
            producto1.put("id", 1);
            producto1.put("cantidad", 1);
            producto1.put("nombre", "Producto de prueba");
            productosTest.add(producto1);

            return descontarStock(productosTest);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(crearError("Error en test: " + e.getMessage()));
        }
    }

    private Map<String, Object> crearError(String mensaje) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", mensaje);
        error.put("timestamp", new Date());
        return error;
    }
}