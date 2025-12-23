from collections.abc import Collection, Mapping
from typing import Callable, TypeVar

T = TypeVar("T")


def dijkstra(
    nodes: Collection[T],
    source_node: T,
    target_nodes: Collection[T],
    find_incoming_neighbors: Callable[[T], (Mapping[T, float])],
) -> float:
    # Initialize distances to 0 for targets, infinity for all others
    distances = {node: float("inf") for node in nodes}
    for state in target_nodes:
        distances[state] = 0

    unvisited = set(nodes)
    while len(unvisited) > 0:
        # Pick smallest-distance unvisited node to visit
        current_node = min(unvisited, key=lambda s: distances[s])
        current_distance = distances[current_node]
        if current_node == source_node:
            return current_distance

        neighbors_distances = find_incoming_neighbors(current_node)

        # Update neighbors' distances
        neighbors_distances = {
            neighbor: distance_from_neighbor
            for neighbor, distance_from_neighbor in neighbors_distances.items()
            if neighbor in unvisited
        }
        for neighbor, distance_from_neighbor in neighbors_distances.items():
            if distance_from_neighbor + current_distance < distances[neighbor]:
                distances[neighbor] = distance_from_neighbor + current_distance

        unvisited.remove(current_node)

    return distances[source_node]


def dijkstra_full(
    nodes: Collection[T],
    target_nodes: Collection[T],
    find_incoming_neighbors: Callable[[T], (Mapping[T, float])],
) -> dict[T, tuple[float, Collection[T]]]:
    # Initialize distances to 0 for targets, infinity for all others
    distances = {node: (float("inf"), set()) for node in nodes}
    for state in target_nodes:
        distances[state] = (0, set())

    unvisited = set(nodes)
    while len(unvisited) > 0:
        # Pick smallest-distance unvisited node to visit
        current_node = min(unvisited, key=lambda s: distances[s])
        current_distance, _ = distances[current_node]

        neighbors_distances = find_incoming_neighbors(current_node)

        # Update neighbors' distances
        neighbors_distances = {
            neighbor: distance_from_neighbor
            for neighbor, distance_from_neighbor in neighbors_distances.items()
            if neighbor in unvisited
        }
        for neighbor, distance_from_neighbor in neighbors_distances.items():
            if distance_from_neighbor + current_distance < distances[neighbor][0]:
                distances[neighbor] = (
                    distance_from_neighbor + current_distance,
                    {current_node},
                )
            elif distance_from_neighbor + current_distance == distances[neighbor][0]:
                distances[neighbor][1].add(current_node)

        unvisited.remove(current_node)

    return distances
