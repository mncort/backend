console.time("total")
const computeDataTwo = (datos) => {
  const mapAthletes = new Map();
  for (let j = 0; j < datos.length; j++) {
    const element = datos[j];
    if (!mapAthletes.has(element.name)) {
      const initValueAthletes = {
        gold: 0,
        bronze: 0,
        silver: 0,
        total: 0
      }
      mapAthletes.set(element.name + " " + element.team, initValueAthletes)
    }
  }

  for (let j = 0; j < datos.length; j++) {
    const element = datos[j];
    const athletes = mapAthletes.get(element.name + " " + element.team);
    if (element.medal === "Gold") {
      athletes.gold = athletes.gold + 1;
    }
    if (element.medal === "Bronze") {
      athletes.bronze = athletes.bronze + 1;
    }
    if (element.medal === "Silver") {
      athletes.silver = athletes.silver + 1;
    }
    athletes.total = athletes.total + 1;
    mapAthletes.set(element.name + " " + element.team, athletes)

  }

  const arrayAthletes = [];
  mapAthletes.forEach((value, key) => {
    const totalMedalByAthletes = {
      name: key,
      gold: value.gold,
      silver: value.silver,
      bronce: value.bronze,
      total: value.total
    };
    arrayAthletes.push(totalMedalByAthletes);

  })
  return arrayAthletes
}
let datos = [{name:"pepe", team:"equipo1", medal: "Gold"},{name:"juan", team:"equipo2"},{name:"toto", team:"equipo1", medal: "Gold"}]
console.log(computeDataTwo(datos))
console.timeEnd("total")

const computeDataThree = (datos) => {
    let arrayAcomodado = datos.map(atleta => {
        let total = 0
        const totalizador = (valor) => {
            total++
            return valor
        }
        return {
            name: atleta.name + " " + atleta.team,
            gold: atleta.medal == "Gold" ? totalizador(1) : 0,
            silver: atleta.medal == "Silver" ? totalizador(1) : 0,
            bronce: atleta.medal == "Bronce" ? totalizador(1) : 0,
            total
        }
    })
    return arrayAcomodado
}
console.log(computeDataThree(datos))
