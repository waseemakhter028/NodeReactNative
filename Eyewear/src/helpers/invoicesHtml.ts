const genterateInvoiceHtml = (data: any) => {
  const {products, payment_method, orderInfo, order_time, coupon} = data;
  let html = `<!doctype html>
 <html lang="en">
 
 <head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     <meta name="viewport" content="width=display-width, initial-scale=1.0, maximum-scale=1.0," />
     <title>Eyewear</title>
 </head>
 
 <body
     style="width:100%; margin:0; padding:50px 5px 140px; width:100%; -webkit-text-size-adjust:none; -ms-text-size-adjust:none; background: #fff; font-family: 'avenirroman'; overflow-x: hidden;">
     <div style="margin: 0 auto; max-width: 700px;">
         <table width="100%" border="0" cellpadding="0" cellspacing="0">
             <tr>
                 <td style="text-align: center;">
                     <img src="${
                       process.env.IMAGE_URL + '/applogo.png'
                     }" alt="weblogo" style="width: 30%; height: 8%;">
                 </td>
             </tr>
         </table>
         <table style="padding: 35px 32px 30px;" width="100%" border="0" cellpadding="0" cellspacing="0"
             bgcolor="#ffffff">
             <!-- Title-->
             <tr>
                 <td>
                     <table width="100%" border="0" cellpadding="0" cellspacing="0"
                         style="text-align: center; margin-bottom: 25px;">
                         <tr>
                             <td>
                                 <h1
                                     style="margin: 0 0 45px; font-size: 55px; font-weight: normal;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                                     Thank you for your order!
                                 </h1>
                             </td>
                         </tr>
 
                         <tr>
                             <td
                                 style="padding-bottom: 30px; color: #EA5C44; font-size: 25px;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                                 Order ID: ${orderInfo.order_id}
                             </td>
                         </tr>
                         <tr>
                             <td
                                 style="color: #BDBDBD;font-family:arial, 'helvetica neue', helvetica, sans-serif; font-size: 18px;">
                                Order Date: ${order_time} </td>
                         </tr>
                     </table>
                 </td>
             </tr>`;

  html += `
  <!--Oreder Detail-->
  <tr>
      <td>
          <table class="detail-table" width="100%" cellpadding="0" cellspacing="0">
              <tbody>`;

  let subtotal: number = 0;
  for (let row of products) {
    html += `<tr style="font-size: 25px;">
                      <td style="padding: 20px 8px; vertical-align: middle;border-top:1px solid #E0E0E0">
                          <p
                              style="margin: 0 0 5px; font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                              ${row.product_id.name}</p>
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; color:#828282; border-top:1px solid #E0E0E0;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                          x${row.quantity}
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; font-family:arial, 'helvetica neue', helvetica, sans-serif;border-top:1px solid #E0E0E0">
                          <span>
                              ${row.price.toFixed(2)}
                          </span>
                      </td>
                  </tr>`;

    subtotal += row.quantity * row.price;
  } // for loop close
  subtotal = Number(subtotal.toFixed(2));

  html += `<tr style="font-size: 25px;">
                      <td
                          style="padding: 20px 8px; vertical-align: middle; color:#828282; font-family:arial, 'helvetica neue', helvetica, sans-serif;border-top:1px solid #E0E0E0">
                          Subtotal
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; color:#828282;border-top:1px solid #E0E0E0">
                          &nbsp;
                      </td>
                      <td
                          style="padding: 20px 8px; color:#828282; vertical-align: middle; text-align: right; font-family:arial, 'helvetica neue', helvetica, sans-serif;border-top:1px solid #E0E0E0">
                          ${subtotal.toFixed(2)}
                      </td>
                  </tr>
                  <tr style="font-size: 25px;">
                      <td
                          style="padding: 20px 8px; vertical-align: middle; color:#828282; font-family:arial, 'helvetica neue', helvetica, sans-serif;border-top:1px solid #E0E0E0">
                          Delivery Charge
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; color:#828282;border-top:1px solid #E0E0E0">
                          &nbsp;
                      </td>
                      <td
                          style="padding: 20px 8px; color:#828282; vertical-align: middle; text-align: right; font-family:arial, 'helvetica neue', helvetica, sans-serif; border-top:1px solid #E0E0E0">
                          ${orderInfo.delivery_charge.toFixed(2)} </td>
                  </tr>`;

  let couponAmount: number = 0;

  if (coupon != null) {
    html += `<tr style="font-size: 25px;">
                      <td
                          style="padding: 20px 8px; vertical-align: middle; color:#828282; font-family:arial, 'helvetica neue', helvetica, sans-serif;border-top:1px solid #E0E0E0">
                          Coupon Applied (${
                            coupon.user_coupon_id.coupon_id.title
                          })
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; color:#828282;border-top:1px solid #E0E0E0">
                          &nbsp;
                      </td>
                      <td
                          style="padding: 20px 8px; color:#828282; vertical-align: middle; text-align: right; font-family:arial, 'helvetica neue', helvetica, sans-serif; border-top:1px solid #E0E0E0">
                          -${coupon.user_coupon_id.coupon_amount.toFixed(2)} 
                      </td>
                  </tr>`;

    couponAmount = coupon.user_coupon_id.coupon_amount;
  }

  let total: string | number =
    parseFloat(subtotal.toString()) +
    parseFloat(orderInfo.delivery_charge) -
    parseFloat(couponAmount.toString());

  total = total > 0 ? total.toFixed(2).toString() : 0.0;

  html += `</tbody>
              <tfoot>
                  <tr style="font-size: 28px;">
                      <td
                          style="padding: 20px 8px; vertical-align: middle; font-family:arial, 'helvetica neue', helvetica, sans-serif; border-top:1px solid #333333; border-bottom: 1px solid #333333;">
                          Grand Total
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; border-top:1px solid #333333; border-bottom: 1px solid #333333;">
                          &nbsp;
                      </td>
                      <td
                          style="padding: 20px 8px; vertical-align: middle; text-align: right; font-family:arial, 'helvetica neue', helvetica, sans-serif; border-top:1px solid #333333; border-bottom: 1px solid #333333;">
                          <span style="font-family: DejaVu Sans sans-serif;">&#8377;
                              ${total} </span>
                      </td>
                  </tr>
              </tfoot>
          </table>
      </td>
  </tr>
  `;

  html += ` <!--More Details-->
  <tr style="font-size: 25px;">
      <td>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 12px;">
              <tr>
                  <td colspan="2"
                      style="font-size: 25px; padding-left: 10px; padding-bottom: 1px;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                      More Details
                  </td>
              </tr>
              <tr style="font-size: 35px;">
                  <td
                      style="color: #828282; font-size: 25px; padding: 10px 8px; width:35%;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                      Payment Mode:
                  </td>
                  <td
                      style="font-size: 25px; padding: 10px 8px;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                      ${payment_method} </td>
              </tr>
              <tr style="font-size: 35px;">
                  <td
                      style="color: #828282; font-size: 25px; padding: 10px 8px; width:35%;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                      Additional Notes:
                  </td>
                  <td
                      style="font-size: 25px; padding: 10px 8px;font-family:arial, 'helvetica neue', helvetica, sans-serif;">
                      ${orderInfo.notes}
                  </td>
              </tr>

          </table>
      </td>
  </tr>`;

  html += `
  <!--contact section-->
  <tr style="font-size: 25px;">

      <td style="font-size: 20px;font-family:arial, 'helvetica neue', helvetica, sans-serif; padding-top: 20px;">
          Notice anything wrong with your order? <a href="#"
              style="color: #EB5757; text-decoration: underline;" target="_blank">Contact us using the app</a> and we'll be
          happy to help.
      </td>
  </tr>
</table>
</div>
</body>

</html>
  `;

  return html;
};

export default genterateInvoiceHtml;
