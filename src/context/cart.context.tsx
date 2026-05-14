import { createContext, ReactNode, useContext, useMemo } from "react";
import { IProduct } from "../utils/interfaces/product.interface";
import { useLocalStorage } from "react-use";
import { ICart, ICartItem } from "../utils/interfaces/cart.interface";
import { currencyExchangerNumber } from "../utils/utils";
import { toast } from "react-toastify";

const cartInitialValue: ICart = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

const normalizeCart = (cart: ICart | undefined): ICart => {
  const items = Array.isArray(cart?.items) ? cart.items : [];
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cartInitialValue,
    ...cart,
    items,
    totalPrice,
    totalItems,
  };
};

interface ICartContext {
  handleAddToCart: (product: IProduct, quantity: number) => void;
  handleRemoveFromCart: (cartItem: ICartItem) => void;
  modifyCartItem: (cartItem: ICartItem, quantity: number) => void;
  cart: ICart;
}

const CartContext = createContext<ICartContext | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("CartContext must be used in Provider");

  return context;
};

interface IProps {
  children: ReactNode;
}

export const CartContextProvider = ({ children }: IProps) => {
  const [cart, setCart] = useLocalStorage<ICart | undefined>(
    "cart",
    cartInitialValue
  );
  const normalizedCart = normalizeCart(cart);

  const handleAddToCart = (product: IProduct, quantity: number) => {
    const isProductAlreadyInCart = normalizedCart.items.some(
      (p) => p.id === product.id
    );

    toast.success("Mahsulot savatga qo'shildi");

    if (isProductAlreadyInCart) {
      const updatedCartItems = normalizedCart.items.map((cartItem) => {
        if (cartItem.id === product.id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + quantity,
          };
        }

        return cartItem;
      });

      setCart(
        normalizeCart({
          ...normalizedCart,
          items: updatedCartItems,
        })
      );

      return;
    }

    const cartItem: ICartItem = {
      id: product.id,
      images: product.images,
      price: currencyExchangerNumber(product.price),
      quantity,
      title: product.title,
    };

    setCart(
      normalizeCart({
        ...normalizedCart,
        items: [...normalizedCart.items, cartItem],
      })
    );
  };

  const handleRemoveFromCart = (cartItem: ICartItem) => {
    const updatedCartItems = normalizedCart.items.filter(
      (item) => item.id !== cartItem.id
    );

    setCart(
      normalizeCart({
        ...normalizedCart,
        items: updatedCartItems,
      })
    );
  };

  const modifyCartItem = (cartItem: ICartItem, productQuantity: number) => {
    const updatedCartItems = normalizedCart.items.map((item) => {
      if (item.id === cartItem.id) {
        return {
          ...item,
          quantity: productQuantity,
        };
      }

      return item;
    });

    setCart(
      normalizeCart({
        ...normalizedCart,
        items: updatedCartItems,
      })
    );
  };

  const value = useMemo(() => {
    return {
      handleAddToCart,
      handleRemoveFromCart,
      modifyCartItem,
      cart: normalizedCart,
    };
  }, [normalizedCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
