'use strict';
module.exports = (sequelize, DataTypes) => {
  const productos = sequelize.define('productos', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.DECIMAL,
    imagen: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    categoriaProductoId: DataTypes.INTEGER
  }, {});
  productos.associate = function(models) {
    productos.belongsTo(models.categoriaProducto);
    productos.belongToMany(models.usuarios,{
      through: 'productoUsuario',
      timestamps: false
    });
    };
    return productos;
};