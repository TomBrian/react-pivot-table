import React, { Component } from 'react';
const axios = require('axios');
class Pivot extends Component {
	state = {
		Orders: [],
		UStates: [],
		Categories: [],
		orderBySubCategories: {},
		subCategoryValues: {}
	}
	getOrders() {
		axios.get('salesOrders.json').then((res) => {
			const orders = res.data
			this.setState({ Orders: orders });
		}).then(() => {
			this.getUStates();
			this.calculateStateCategoryTotals();
		})
	}
	getSubCategories() {
		const subCatBag = {};
		this.state.Categories.forEach(category => {
			const orders = this.state.Orders
			orders.forEach((order) => {
				const orderCategory = order.category;
				const orderSubCategory = order.subCategory;
				if (orderCategory === category) {
					// set the value of the category key to an empty array if the key has not been added yet
					if (subCatBag[category] === undefined) {
						subCatBag[category] = [];
					}
					// if the key value array already exists add new and unique subcategories
					if (subCatBag[category].indexOf(orderSubCategory) < 0) {
						subCatBag[category].push(orderSubCategory)
					}
				}
			});
		});
		this.setState({
			orderBySubCategories: subCatBag
		})
	}
	subCategoryGrandTotals(subcat) {
		var amountBag = []
		this.state.Orders.forEach((order) => {
			if (order.subCategory === subcat) {
				amountBag.push(order.sales);
			}
		})
		return this.addMe(amountBag)
	}
	addMe(amountBag) {
		var sumTotal = '';
		if (amountBag.length > 0) {
			sumTotal = amountBag.reduce(addAll)
		}
		function addAll(total, amount) {
			return total + amount
		}

		return Math.round(sumTotal);
	}
	CategoryGrandTotals(category) {

		var amountBag = []
		this.state.Orders.forEach((order) => {
			if (order.category === category) {
				amountBag.push(order.sales);
			}
		})
		return this.addMe(amountBag)
	}
	overallGrandTotal() {
		var amountBag = []
		this.state.Orders.forEach((order) => {
			amountBag.push(order.sales);
		})
		return this.addMe(amountBag)
	}
	StateGrandTotals(state) {
		var amountBag = []
		this.state.Orders.forEach((order) => {
			if (order.state === state) {
				amountBag.push(order.sales);
			}
		})
		return this.addMe(amountBag)
	}
	calculateStateCategoryTotals(state, category) {
		const amountBag = []
		this.state.Orders.forEach((order) => {
			if (order.state === state && order.category === category) {
				amountBag.push(order.sales)
			}
		})
		// console.log(amountBag)
		return this.addMe(amountBag)
	}
	removeCategory(catArg) {
		var categories = this.state.Categories;
		for (let i = 0; i < categories.length; i++) {
			const category = categories[i];
			if (category === catArg) {
				console.log(category + ' - ' + catArg)
				categories.splice(i, 1);
			}
		}
		this.setState({ Categories: categories })
	}
	calculateSubCategoryTotals(state, category, subcategory) {
		const amountBag = []
		this.state.Orders.forEach((order) => {
			if (order.state === state && order.category === category && order.subCategory === subcategory) {
				amountBag.push(order.sales)
			}
		})
		// console.log(amountBag) 
		return this.addMe(amountBag)
	}
	getCategories() {
		const catBag = []
		this.state.Orders.forEach((order) => {
			if (catBag.indexOf(order.category) < 0) {
				catBag.push(order.category);
			}
		})
		catBag.sort();
		this.setState({
			Categories: catBag
		});
		this.getSubCategories();
	}
	getUStates() {
		const stateBag = []
		this.state.Orders.forEach((order) => {
			const state = order.state;
			if (stateBag.indexOf(state) < 0) {
				stateBag.push(state);
			}
		})
		stateBag.sort();
		this.setState({ UStates: stateBag });
		this.getCategories();
	}
	componentDidMount() {
		this.getOrders();
	}

	render() {

		return (
			<div>
				<div className="flex tables-wrapper w-full">
					<div className="products w-1/4 shadow-lg">
						<div className="header p-3 bg-blue-900 text-white font-bold">
							Products
						</div>
						<div className="table-wrap">
							<table>
								<thead className="bg-blue-900 text-opacity-70 text-white">
									<tr>
										<th>Category</th>
										<th>Sub-Category</th>
									</tr>
								</thead>
								<tbody className="text-blue-900">
									{this.state.Categories.map((category) => {
										return [<tr className="border-b-2" key={category}>
											<th>
												<div className="flex justify-between align-middle">
													<div>
														<button onClick={() => { this.removeCategory(category) }} className="remove-category mx-3 bg-red-800 text-white text-lg">-</button> &nbsp;
													</div>
													<div>{category}</div>
												</div>
											</th>
											<th className="main-td">
												<table>
													<tbody>
														{this.state.orderBySubCategories[category] !== undefined ? this.state.orderBySubCategories[category].map((subCat) => {
															return <tr className="text-blue-900 text-opacity-90 font-medium" key={subCat}><td className="subcat-td">{subCat}</td></tr>
														}) : false}
													</tbody>
												</table>
											</th>
										</tr>,
										<tr className="total" key={Math.random()}><th>{category} total</th> <th></th></tr>
										]
									})}
									<tr className="total-footer bg-blue-600 text-white" key={Math.random()}><th className="py-4">grand total</th> <th className="py-4"></th></tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="states text-center">
						<div className="header p-3 bg-blue-900 text-white font-bold">
							States
						</div>
						<div className="table-wrap">
							<table>
								<thead className="bg-blue-900 text-opacity-70 text-white">
									<tr>
										<td>
											<table>
												<tbody>
													<tr>
														{this.state.UStates.map((x) => {
															return <th key={x}>{x}</th>
														})}
														<th>Grand total</th>
													</tr>
												</tbody>
											</table></td>

									</tr>
								</thead>

								<tbody>
									{this.state.Categories.map((category) => {
										return [
											<tr>
												<td className="main-td">
													<table>
														<tbody>
															{this.state.orderBySubCategories[category] !== undefined ? this.state.orderBySubCategories[category].map((subCat) => {
																return <tr className="text-blue-900 text-opacity-70 font-medium" key={subCat}>
																	{this.state.UStates.map((state) => {
																		return <td className="subcat-td" key={state}>{this.calculateSubCategoryTotals(state, category, subCat)}</td>
																	})}
																	<td>{this.subCategoryGrandTotals(subCat)}</td>
																</tr>
															}) : false}
														</tbody>
													</table>
												</td>
											</tr>,
											<tr className="total">
												<td>
													<table>
														<tbody>
															<tr>
																{this.state.UStates.map((state) => {
																	return <td key={state} className="text-blue-600"><b>{this.calculateStateCategoryTotals(state, category)}</b></td>
																})}
																<td className="text-blue-600"><b>{this.CategoryGrandTotals(category)}</b></td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										]
									})}
									<tr className="total-footer bg-blue-600 text-white">
										<td>
											<table>
												<tbody>
													<tr>
														{this.state.UStates.map((state) => {
															return <td key={state} className="text-white py-4"><b>{this.StateGrandTotals(state)}</b></td>
														})}
														<td className="text-white"><b>{this.overallGrandTotal()}</b></td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Pivot;