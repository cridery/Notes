export async function goGet(url) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  }
  