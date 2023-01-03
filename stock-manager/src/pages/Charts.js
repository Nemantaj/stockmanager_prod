import { Loading } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { Text, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp, TbFileExport } from "react-icons/tb";
import HistoryTable from "../components/HistoryTable";
import * as Xlsx from "xlsx";
import { useSelector } from "react-redux";

const Charts = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.invtry.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentList, setCurrentList] = useState([]);
  const [currentListAdj, setCurrentListAdj] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSort, setCurrentSort] = useState({
    field: "dateAdded",
    asc: false,
  });
  const changeCurrentSort = (field, asc) => {
    setCurrentSort({ field: field, asc: asc });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/get-history", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
        }
        return res.json();
      })
      .then((data) => {
        setCurrentList(data);
        setCurrentListAdj(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  //Sorting Logic
  useEffect(() => {
    if (currentList.length > 0) {
      const listCopy = [...currentList];
      let sortCurrent;

      if (currentSort.field === "name" || currentSort.field === "desc") {
        sortCurrent = listCopy.sort((a, b) => {
          let fa = a[currentSort.field].toLowerCase();
          let fb = b[currentSort.field].toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else {
        sortCurrent = listCopy.sort((a, b) => {
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        });
      }

      setCurrentList(sortCurrent);
      setCurrentListAdj(currentSort.asc ? sortCurrent : sortCurrent.reverse());
    }
  }, [currentSort]);

  //Search Logic
  useEffect(() => {
    if (currentSearch === "" && currentSearch.length > 0) {
      return currentListAdj(currentList);
    }

    if (currentList.length > 0) {
      const timeoutId = setTimeout(() => {
        const regex = new RegExp(currentSearch, "i");
        const allList = [...currentList];
        const filteredList = allList.filter((doc) => {
          return (
            regex.test(doc.dateAdded) ||
            regex.test(doc.name) ||
            regex.test(doc.desc)
          );
        });
        setCurrentListAdj(filteredList);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentSearch]);

  const downloadExcel = () => {
    const data = currentList.map((doc) => {
      let qty;
      if (doc.add) {
        qty = "+" + doc.add;
      } else {
        qty = doc.sub;
      }
      return {
        Date: doc.dateAdded.slice(0, 10),
        Name: doc.name,
        Desc: doc.desc,
        Qty: qty,
      };
    });
    const workSheet = Xlsx.utils.json_to_sheet(data);
    const workBook = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(workBook, workSheet, "Inventory");
    Xlsx.writeFile(workBook, `all-Inventory.xlsx`);
  };

  return (
    <motion.div>
      <motion.div className="header">
        <Link to="/inventory" className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>Inventory History</Text>
        <div className="headerLink headerLinkAddon">
          <Button
            auto
            size="sm"
            color="error"
            icon={<TbFileExport />}
            onClick={downloadExcel}
          />
        </div>
      </motion.div>
      <motion.div className="alignDivCenter tableDiv">
        {loading ? (
          <Loading type="spinner" />
        ) : (
          <Fragment>
            {error && (
              <Text
                color="error"
                css={{
                  br: "12px",
                  bgColor: "$red50",
                  py: "5px",
                  px: "10px",
                  my: "10px",
                }}
              >
                An error occured while trying to retrieve data from the server!
              </Text>
            )}
            <HistoryTable
              list={currentListAdj}
              sortFunction={changeCurrentSort}
              asc={currentSort.asc}
              setValue={setCurrentSearch}
              value={currentSearch}
            />
          </Fragment>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Charts;
