import Order from "../model/order.model.js"
import Cart from "../model/cart.model.js"


export const getSingleOrder = async (request, response) => {
    const { userId } = request.params

    const order = await Order.find({ userId })

    if (!order) {
        return response.status(404).send({ error: "something is wrong" })
    }

    response.status(201).send(order)
}

export const getOrders = async (request, response) => {

    const orders = await Order.find()

    if (!orders) {
        return response.status(404).send({ error: "orders is not found" })
    }


    return response.status(201).send(orders)
}

export const addOrder = async (request, response) => {
    const { totalPrice, orderItems, shippingAdress } = request.body
    const { _id: userId } = request.user

    for (const value of Object.values(shippingAdress)) {
        if (!value) {
            return response.status(404).send({ error: "please filled up all fields" })
        }
    }

    const orderItemsWithAdress = orderItems.map((orderItems) => {
        return { ...orderItems, shippingAdress }
    })

    const newOrder = await Order.create({
        totalPrice,
        userId,
        orderItems: orderItemsWithAdress
    })


    if (!newOrder) {
        return response.status(400).send({ error: "couldn't create a new order" })
    }

    const userCart = await Cart.findOne({ userId })


    if (!userCart) {
        return response.status(400).send({ error: "Simething is wrong" })
    }

    userCart.cartItems = [];
    await userCart.save()

    response.status(201).send(newOrder)
}

