import React, { Component } from 'react'

export class DataTable extends Component {
    props = {
        data: [],
    }
    render() {
        return (
            <table id="example" class="table table-striped table-bordered" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Child Part Number</th>
                        <th>Child Part Description</th>
                        <th>Item Reference Number</th>
                        <th>Quantity Production</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map((item, index) => {
                        return <tr key={index}>
                            <td>{item["Child_Part_Number"]}</td>
                            <td>{item["Child_Part_Description"]}</td>
                            <td>{item["item_reference_number"]}</td>
                            <td>{item["quantity_production"]}</td>
                        </tr>
                    }
                    )}
                </tbody>
            </table>
        )
    }
}

export default DataTable