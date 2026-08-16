import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { 
    cartItems, 
    removeFromCart, 
    decreaseQuantity, 
    addToCart,
    clearCart, 
    getTotalPrice 
  } = useCart();
  
  const totalPrice = getTotalPrice();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega algunos productos');
      return;
    }
    
    if (Platform.OS === 'web') {
      if (window.confirm(`Total: $${totalPrice.toFixed(2)}\n¿Deseas finalizar la compra?`)) {
        setShowThankYou(true);
        clearCart();
      }
    } else {
      Alert.alert(
        'Confirmar compra',
        `Total: $${totalPrice.toFixed(2)}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Comprar', 
            onPress: () => {
              setShowThankYou(true);
              clearCart();
            }
          }
        ]
      );
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    if (Platform.OS === 'web') {
      if (window.confirm('¿Eliminar todos los productos?')) {
        clearCart();
      }
    } else {
      Alert.alert(
        'Vaciar carrito',
        '¿Eliminar todos los productos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Vaciar', 
            onPress: clearCart,
            style: 'destructive'
          }
        ]
      );
    }
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    navigation.navigate('HomeTab');
  };

  if (cartItems.length === 0 && !showThankYou) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Carrito vacío</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.shopButtonText}>Ir a la tienda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem 
            item={item} 
            onRemove={removeFromCart}
            onDecrease={decreaseQuantity}
            onIncrease={addToCart}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showThankYou}
        onRequestClose={handleCloseThankYou}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={80} color="#34C759" />
            <Text style={styles.modalTitle}>🎉 ¡Gracias por tu compra!</Text>
            <Text style={styles.modalText}>
              Tu pedido ha sido procesado exitosamente.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseThankYou}>
              <Text style={styles.modalButtonText}>Volver a la tienda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  clearText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
  list: { padding: 16 },
  footer: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0' 
  },
  totalContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  checkoutButton: { 
    backgroundColor: '#007AFF', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  shopButton: { 
    backgroundColor: '#007AFF', 
    padding: 12, 
    borderRadius: 25, 
    paddingHorizontal: 30 
  },
  shopButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;