import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategorySelect from "../components/CategorySelect";
import CustomNavbar from "../components/CustomNavbar";
import Button from "react-bootstrap/Button";
import { Stack } from "react-bootstrap";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import fetchData from "../utils/fetch";
import { jwtDecode } from "jwt-decode";
import Pagination from "react-bootstrap/Pagination";

export default function Home() {
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Jumlah produk per halaman

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        // Fetch products
        const productsResponse = await fetchData(
          "http://localhost:3000/api/products"
        );
        setProducts(productsResponse.data.data);

        // Fetch tags
        const tagsResponse = await fetchData("http://localhost:3000/api/tags");
        setTags(tagsResponse.data);

        // Fetch categories
        const categoriesResponse = await fetchData(
          "http://localhost:3000/api/categories"
        );
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchDataFromAPI();
  }, []);

  const handleTagClick = (tag) => {
    setActiveTag(tag === activeTag ? null : tag);
  };

  const handleCategoryChange = async (category) => {
    setActiveCategory(category);
    setActiveTag(null); // Reset active tag when category changes

    // Filter tags berdasarkan kategori yang dipilih
    if (category) {
      const selectedCategoryTags = products
        .filter((product) => product.category._id === category)
        .reduce((acc, curr) => {
          curr.tags.forEach((tag) => {
            if (!acc.some((t) => t._id === tag._id)) {
              acc.push({ _id: tag._id, name: tag.name });
            }
          });
          return acc;
        }, []);
      setTags(selectedCategoryTags);
    } else {
      const tagsResponse = await fetchData("http://localhost:3000/api/tags");
      const tagsWithData = tagsResponse.data.map((tag) => ({
        _id: tag._id,
        name: tag.name,
      }));
      setTags(tagsWithData);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter produk berdasarkan kategori, tag, dan pencarian
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory
      ? product.category._id === activeCategory
      : true;
    const matchesTag = activeTag
      ? product.tags.some((tag) => tag.name === activeTag)
      : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesTag && matchesSearch;
  });

  // Menghitung indeks produk yang akan ditampilkan di halaman saat ini
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Mengubah halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <CustomNavbar onSearch={handleSearch} user={user} />
      <CategorySelect
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
      <div className="container mt-3">
        <h5>
          Tags <FaArrowDownWideShort />{" "}
        </h5>
        <div>
          <Stack direction="horizontal" gap={3}>
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <Button
                  key={tag._id} // Gunakan _id sebagai key, pastikan unik
                  variant={activeTag === tag.name ? "primary" : "secondary"}
                  onClick={() => handleTagClick(tag.name)}
                >
                  <MdRestaurantMenu />
                  {tag.name}
                </Button>
              ))}
          </Stack>
        </div>
      </div>
      <div className="container mt-3">
        <h5>Products</h5>
        <ProductCard products={currentProducts} />
        <Pagination className="mt-3">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[
            ...Array(
              Math.ceil(filteredProducts.length / productsPerPage)
            ).keys(),
          ].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage)
            }
          />
        </Pagination>
      </div>
    </>
  );
}
