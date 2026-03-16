import { useState, useEffect, useMemo, useCallback } from "react";
import useOffer from "./useOffer";
import useOperator from "./useOperator";

const ITEMS_PER_PAGE = 10;

export default function useAdminOffersTable() {
 const { getAdminOffers, getAllBenefits, getAllCategories } = useOffer();
 const { getOperators, operators } = useOperator();

 const [offers, setOffers] = useState([]);
 const [benefitsList, setBenefitsList] = useState([]);
 const [categoriesList, setCategoriesList] = useState([]);

 const [searchTerm, setSearchTerm] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [sortColumn, setSortColumn] = useState(null);
 const [sortDirection, setSortDirection] = useState("asc");

 const [loading, setLoading] = useState(false);

 const loadData = useCallback(async () => {
  setLoading(true);

  const [offersData, benefits, categories] = await Promise.all([
   getAdminOffers(),
   getAllBenefits(),
   getAllCategories()
  ]);

  setOffers(offersData || []);
  setBenefitsList(benefits || []);
  setCategoriesList(categories || []);

  getOperators();

  setLoading(false);
 }, [getAdminOffers, getAllBenefits, getAllCategories, getOperators]);

 useEffect(() => {
  loadData();
 }, [loadData]);

 const filteredOffers = useMemo(() => {
  const term = searchTerm.toLowerCase();

  return offers.filter((item) =>
   [item.name, item.description, item.operator_name, item.category_name]
    .join(" ")
    .toLowerCase()
    .includes(term)
  );
 }, [offers, searchTerm]);

 const sortedOffers = useMemo(() => {
  if (!sortColumn) return filteredOffers;

  return [...filteredOffers].sort((a, b) => {
   let valA = a[sortColumn];
   let valB = b[sortColumn];

   if (sortColumn === "price") {
    valA = Number(valA || 0);
    valB = Number(valB || 0);
   } else {
    valA = (valA ?? "").toString().toLowerCase();
    valB = (valB ?? "").toString().toLowerCase();
   }

   if (valA < valB) return sortDirection === "asc" ? -1 : 1;
   if (valA > valB) return sortDirection === "asc" ? 1 : -1;

   return 0;
  });
 }, [filteredOffers, sortColumn, sortDirection]);

 const totalPages = Math.ceil(sortedOffers.length / ITEMS_PER_PAGE);

 const paginatedOffers = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return sortedOffers.slice(start, start + ITEMS_PER_PAGE);
 }, [sortedOffers, currentPage]);

 return {
  loading,
  operators,
  benefitsList,
  categoriesList,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  sortColumn,
  sortDirection,
  setSortColumn,
  setSortDirection,
  paginatedOffers,
  sortedOffers,
  totalPages,
  setOffers,
  loadData
 };
}