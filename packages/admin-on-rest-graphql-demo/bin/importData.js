import gql from 'graphql-tag';
import 'isomorphic-fetch';
import add_months from 'date-fns/add_months';
import apolloClient from '../src/apolloClient';
import data from './data';

const createCategory = category => apolloClient.mutate({
    mutation: gql`
        mutation createCategory($name: String!) {
            createCategory(name: $name) { id }
        }
    `,
    variables: { name: category.name },
}).then(response => ({ id: category.id, newId: response.data.createCategory.id }));

const createProduct = product => apolloClient.mutate({
    mutation: gql`
        mutation createProduct(
            $reference: String!,
            $description: String!,
            $width: Float!,
            $height: Float!,
            $price: Float!,
            $image: String!,
            $thumbnail: String!
            $stock: Int!
            $categoryId: ID!
        ) {
            createProduct(
                reference: $reference,
                description: $description,
                width: $width,
                height: $height,
                price: $price,
                image: $image,
                thumbnail: $thumbnail,
                stock: $stock,
                categoryId: $categoryId
            ) { id }
        }
    `,
    variables: {
        reference: product.reference,
        description: product.description,
        width: product.width,
        height: product.height,
        price: product.price,
        image: product.image,
        thumbnail: product.thumbnail,
        stock: product.stock,
        categoryId: product.categoryId,
    },
}).then(response => ({ id: product.id, newId: response.data.createProduct.id }));

const createCustomer = customer => apolloClient.mutate({
    mutation: gql`
        mutation createCustomer(
            $firstName: String,
            $lastName: String,
            $email: String,
            $address: String,
            $zipcode: String,
            $city: String,
            $avatar: String,
            $birthday: DateTime,
            $firstSeen: DateTime,
            $lastSeen: DateTime,
            $latestPurchase: DateTime,
            $hasOrdered: Boolean,
            $hasNewsletter: Boolean,
            $nbCommands: Int,
            $totalSpent: Float,
            $groupsIds: [ID!],
        ) {
            createCustomer(
                firstName: $firstName,
                lastName: $lastName,
                email: $email,
                address: $address,
                zipcode: $zipcode,
                city: $city,
                avatar: $avatar,
                birthday: $birthday,
                firstSeen: $firstSeen,
                lastSeen: $lastSeen,
                latestPurchase: $latestPurchase,
                hasOrdered: $hasOrdered,
                hasNewsletter: $hasNewsletter,
                nbCommands: $nbCommands,
                totalSpent: $totalSpent,
                groupsIds: $groupsIds,
            ) { id }
        }
    `,
    variables: {
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        address: customer.address,
        zipcode: customer.zipcode,
        city: customer.city,
        avatar: customer.avatar,
        birthday: customer.birthday,
        firstSeen: customer.first_seen ? add_months(customer.first_seen, 1) : customer.first_seen,
        lastSeen: customer.last_seen ? add_months(customer.last_seen, 1) : customer.last_seen,
        latestPurchase: customer.latest_purchase ? add_months(customer.latest_purchase, 1) : customer.latest_purchase,
        hasOrdered: customer.has_ordered,
        hasNewsletter: customer.has_newsletter,
        nbCommands: customer.nb_commands,
        totalSpent: customer.total_spent,
        groupsIds: customer.groupsIds,
    },
}).then(response => ({ id: customer.id, newId: response.data.createCustomer.id }));

const createCommand = command => apolloClient.mutate({
    mutation: gql`
        mutation createCommand(
            $reference: String!,
            $date: DateTime!,
            $totalExTaxes: Float!,
            $deliveryFees: Float!,
            $taxRate: Float!,
            $taxes: Float!,
            $total: Float!
            $status: String!
            $returned: Boolean!
            $customerId: ID!
        ) {
            createCommand(
                reference: $reference,
                date: $date,
                totalExTaxes: $totalExTaxes,
                deliveryFees: $deliveryFees,
                taxRate: $taxRate,
                taxes: $taxes,
                total: $total,
                status: $status,
                returned: $returned
                customerId: $customerId
            ) { id }
        }
    `,
    variables: {
        reference: command.reference,
        date: command.date ? add_months(command.date, 1) : command.date,
        totalExTaxes: command.total_ex_taxes,
        deliveryFees: command.delivery_fees,
        taxRate: command.tax_rate,
        taxes: command.taxes,
        total: command.total,
        status: command.status,
        returned: command.returned,
        customerId: command.customerId,
    },
}).then(response => ({ id: command.id, newId: response.data.createCommand.id }));

const createCommandItem = commandItem => apolloClient.mutate({
    mutation: gql`
        mutation createCommandItem($commandId: ID!, $productId: ID!, $quantity: Int!) {
            createCommandItem(commandId: $commandId, productId: $productId, quantity: $quantity) { id }
        }
    `,
    variables: commandItem,
}).then(response => ({ newId: response.data.createCommandItem.id }));

const createReview = review => apolloClient.mutate({
    mutation: gql`
        mutation createReview(
            $commandId: ID!,
            $productId: ID!,
            $customerId: ID!,
            $status: String!,
            $date: DateTime!,
            $rating: Int!,
            $comment: String!
        ) {
            createReview(
                commandId: $commandId,
                productId: $productId,
                customerId: $customerId,
                status: $status,
                date: $date,
                rating: $rating,
                comment: $comment
            ) { id }
        }
    `,
    variables: {
        ...review,
        date: review.date ? add_months(review.date, 1) : review.date,
    },
}).then(response => ({ newId: response.data.createReview.id }));

const createSegment = group => apolloClient.mutate({
    mutation: gql`
        mutation createSegment($name: String!) {
            createSegment(name: $name) { id }
        }
    `,
    variables: { name: group },
}).then(response => ({ id: group, newId: response.data.createSegment.id }));

const createData = async () => {
    try {
        const categoriesById = await Promise.all(data.categories.map(createCategory));
        const productsById = await Promise.all(data.products.map(({ category_id, ...product }) => {
            const categoryId = categoriesById.find(c => c.id === category_id).newId;

            if (!categoryId) {
                return Promise.reject(`Could not find product ${product.id} category`, category_id);
            }

            return createProduct({ ...product, categoryId });
        }));

        const distinctGroups = data.customers.reduce((acc, customer) => {
            if (customer.groups && customer.groups.length > 0) {
                acc.add(...customer.groups);
            }

            return acc;
        }, new Set());

        const groupsById = await Promise.all(Array.from(distinctGroups).map(createSegment));
        const customersById = await Promise.all(data.customers.map(({ groups, ...customer }) => {
            const groupsIds = groupsById.filter(g => groups.includes(g.id)).map(g => g.newId);

            return createCustomer({ ...customer, groupsIds });
        }));

        const commandsById = await Promise.all(data.commands.map(async ({ basket, customer_id, ...command }) => {
            const customerId = customersById.find(c => c.id === customer_id).newId;

            if (!customerId) {
                return Promise.reject(`Could not find command ${command.id} customer`, customer_id);
            }

            const newCommand = await createCommand({ ...command, customerId });

            await Promise.all(basket.map(({ product_id, quantity }) => {
                const productId = productsById.find(p => p.id === product_id).newId;

                if (!productId) {
                    return Promise.reject(`Could not find command ${command.id} product`, product_id);
                }

                return createCommandItem({ commandId: newCommand.newId, productId, quantity });
            }));

            return newCommand;
        }));

        await Promise.all(data.reviews.map(({ command_id, product_id, customer_id, ...review }) => {
            const commandId = commandsById.find(c => c.id === command_id).newId;
            const productId = productsById.find(c => c.id === product_id).newId;
            const customerId = customersById.find(c => c.id === customer_id).newId;

            if (!commandId) {
                return Promise.reject(`Could not find review ${review.id} command`, command_id);
            }
            if (!productId) {
                return Promise.reject(`Could not find review ${review.id} product`, product_id);
            }
            if (!customerId) {
                return Promise.reject(`Could not find review ${review.id} customer`, customer_id);
            }

            return createReview({ ...review, commandId, productId, customerId });
        }));
    } catch (err) {
        console.error(err.stack);
    }
};

createData().then(() => console.log('Data imported'));
