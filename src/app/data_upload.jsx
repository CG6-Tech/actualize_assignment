import React, { Component } from 'react';
import * as xlsx from "xlsx";
import { getFirestore, collection, writeBatch, doc, getDocs } from "firebase/firestore";
import firebaseApp from './firebase_connect';
import DataTable from './data_table';


export class DataUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            data: [],
            loading: false,
            error: null,
            success: null
        }
        this.getData = this.getData.bind(this);
    }

    selectFile(event) {
        event.preventDefault();
        if (event.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                this.setState({
                    file: {
                        name: event.target.files[0].name,
                        data: data
                    }
                });
            };
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    }

    convertToJson() {
        if (this.state.file === null) {
            alert('Please select a file');
            return;
        }
        const workbook = xlsx.read(this.state.file.data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        return json;
    }

    async uploadToDatabase() {
        try {
            let data = this.convertToJson();
            if (data.length === 0) {
                alert('No data to upload');
                return;
            }
            this.setState({ loading: true });
            const firestore = getFirestore(firebaseApp);
            const batch = writeBatch(firestore);
            data.forEach(item => {
                const docRef = doc(firestore, 'sampledata/' + item.Child_Part_Number);
                batch.set(docRef, item);
            })
            await batch.commit();
            this.setState({ loading: false, success: 'Data uploaded successfully' });
            this.getData();
            alert('Uploaded to database');
        } catch (error) {
            console.log(error);
        }
    }

    async getData() {
        const firestore = getFirestore(firebaseApp);
        const collectionRef = collection(firestore, 'sampledata');
        const response = await getDocs(collectionRef);
        let data = response.docs.map(element => {
            return {
                id: element.id,
                ...element.data()
            }
        })
        console.log(data);
        this.setState({ data });
    }

    async wipeData() {
        try {
            const firestore = getFirestore(firebaseApp);
            const batch = writeBatch(firestore);
            this.state.data.forEach(element => {
                batch.delete(doc(firestore, 'sampledata/' + element.id));
            })
            await batch.commit();
            this.setState({ success: 'Data wiped successfully' });
            this.getData();
            alert('Data wiped successfully');
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div className='data-upload-container'>
                <div className="nav-bar">
                    <h2 className="nav-title">Excel Data Import</h2>
                    <div className="spacer"></div>
                    <form>
                        <div className={this.state.file ? 'file-input chosen' : 'file-input'}>
                            <input type='file' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.selectFile.bind(this)} />
                            <span className='button' >Choose</span>
                            <span className='label'>{this.state.file ? this.state.file.name : "No file selected"}</span>
                        </div>

                    </form>
                    <button className="upload-btn" disabled={this.state.loading} onClick={this.uploadToDatabase.bind(this)}>
                        {this.state.loading ? "Uploading" : 'Upload'}
                    </button>
                </div>
                <br />
                {
                    this.state.data.length > 0 && <button className="remove-btn" onClick={this.wipeData.bind(this)}>
                        Wipe data from Database
                    </button>
                }
                <br />
                <br />
                <div className="data-container">
                    <DataTable data={this.state.data}></DataTable>
                </div>
            </div>
        )
    }
}

export default DataUpload