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

export default function Home() {
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);

  const handleTagClick = (tag) => {
    setActiveTag(tag === activeTag ? null : tag);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Update tags based on selected category
    if (category) {
      const selectedCategoryTags = products
        .filter((product) => product.category._id === category)
        .reduce((acc, curr) => {
          curr.tags.forEach((tag) => {
            if (!acc.includes(tag.name)) {
              acc.push(tag.name);
            }
          });
          return acc;
        }, []);
      setTags(selectedCategoryTags);
    } else {
      // Reset tags to show all tags when "Semua Kategori" is selected
      const allTags = products.reduce((acc, curr) => {
        curr.tags.forEach((tag) => {
          if (!acc.includes(tag.name)) {
            acc.push(tag.name);
          }
        });
        return acc;
      }, []);
      setTags(allTags);
    }
    setActiveTag(null); // Reset active tag when category changes
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchData("http://localhost:3000/api/products");
        console.log(response.data.data);
        setProducts(response.data.data);

        const extractedTags = response.data.data.reduce((acc, curr) => {
          curr.tags.forEach((tag) => {
            if (!acc.includes(tag.name)) {
              acc.push(tag.name);
            }
          });
          return acc;
        }, []);
        setTags(extractedTags);

        const extractedCategories = response.data.data.map(
          (product) => product.category
        );
        const uniqueCategories = Array.from(
          new Set(extractedCategories.map((cat) => cat._id))
        ).map((id) => extractedCategories.find((cat) => cat._id === id));

        setCategories(uniqueCategories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

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

  console.log(user);
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
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "primary" : "secondary"}
                onClick={() => handleTagClick(tag)}
              >
                <MdRestaurantMenu />
                {tag}
              </Button>
            ))}
          </Stack>
        </div>
      </div>
      <ProductCard products={filteredProducts} />
    </>
  );
}
