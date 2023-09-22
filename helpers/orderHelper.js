


const Order = require('../models/orderModel')

const chartOrderDataFilter = ()=>{

    return new Promise(async (resolve,reject)=>{

        const aggregate = await Order.aggregate([
            {
                $match:{$and:[{cancelledOrder:false},{orderStatus:{$ne:'Returned'}}]}
            },
            {
                $group:{
                    _id:{
                        year:{$year:'$date'},
                        month:{$month:'$date'},
                        day:{$dayOfMonth:'$date'}
                    },
                    totalOrderValue:{$sum:'$orderValue'}
                }
            },
               { $project:{
                    _id:0,
                    year:'$_id.year',
                    month:'$_id.month',
                    day:'$_id.day',
                    totalOrderValue:1
                }
            },
            {
               $sort:{year:1,month:1,day:1}
            }
        ])

        console.log(aggregate);
    })
}



module.exports={
    chartOrderDataFilter
}