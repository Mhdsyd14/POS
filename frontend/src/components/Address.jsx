import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Address = ({ addresses }) => {
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    detail: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    // Fetch list of provinces
    axios
      .get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam mengambil data provinsi!", error);
      });
  }, []);

  useEffect(() => {
    // Fetch list of regencies when province changes
    if (newAddress.provinsi) {
      const selectedProvince = provinces.find(
        (province) => province.name === newAddress.provinsi
      );
      if (selectedProvince) {
        axios
          .get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
          )
          .then((response) => {
            setRegencies(response.data);
          })
          .catch((error) => {
            console.error(
              "Ada kesalahan dalam mengambil data kabupaten!",
              error
            );
          });
      }
    } else {
      setRegencies([]);
    }
  }, [newAddress.provinsi, provinces]);

  useEffect(() => {
    // Fetch list of districts when regency changes
    if (newAddress.kabupaten) {
      const selectedRegency = regencies.find(
        (regency) => regency.name === newAddress.kabupaten
      );
      if (selectedRegency) {
        axios
          .get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`
          )
          .then((response) => {
            setDistricts(response.data);
          })
          .catch((error) => {
            console.error(
              "Ada kesalahan dalam mengambil data kecamatan!",
              error
            );
          });
      }
    } else {
      setDistricts([]);
    }
  }, [newAddress.kabupaten, regencies]);

  useEffect(() => {
    // Fetch list of villages when district changes
    if (newAddress.kecamatan) {
      const selectedDistrict = districts.find(
        (district) => district.name === newAddress.kecamatan
      );
      if (selectedDistrict) {
        axios
          .get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`
          )
          .then((response) => {
            setVillages(response.data);
          })
          .catch((error) => {
            console.error(
              "Ada kesalahan dalam mengambil data kelurahan!",
              error
            );
          });
      }
    } else {
      setVillages([]);
    }
  }, [newAddress.kecamatan, districts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Simpan alamat baru ke database
      await axios.post(
        "http://localhost:3000/api/delivery-addresses",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form dan sembunyikan form setelah berhasil menambahkan
      setNewAddress({
        name: "",
        detail: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kelurahan: "",
      });
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Ada kesalahan dalam mengirim data!", error);
    }
  };

  return (
    <div className="table-responsive mb-4">
      <h2>Alamat</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Alamat Lengkap</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr key={index}>
              <td>{address.name}</td>
              <td>{address.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={() => setShowForm(true)}>
        Tambah alamat
      </button>

      {showForm && (
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={newAddress.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Detail Alamat</label>
            <input
              type="text"
              className="form-control"
              name="detail"
              value={newAddress.detail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Provinsi</label>
            <select
              className="form-control"
              name="provinsi"
              value={newAddress.provinsi}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Kabupaten</label>
            <select
              className="form-control"
              name="kabupaten"
              value={newAddress.kabupaten}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kabupaten</option>
              {regencies.map((regency) => (
                <option key={regency.id} value={regency.name}>
                  {regency.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Kecamatan</label>
            <select
              className="form-control"
              name="kecamatan"
              value={newAddress.kecamatan}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kecamatan</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Kelurahan</label>
            <select
              className="form-control"
              name="kelurahan"
              value={newAddress.kelurahan}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kelurahan</option>
              {villages.map((village) => (
                <option key={village.id} value={village.name}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success me-2">
            Tambah
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Batal
          </button>
        </form>
      )}
    </div>
  );
};

export default Address;
